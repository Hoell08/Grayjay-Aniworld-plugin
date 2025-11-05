# Bug Fix: Duplicate Declaration Error

## The Problem

### Error Message
```
[EXCEPTION]
Call [enable] failed due to: (ScriptExecutionException) [Aniworld] 
Identifier 'Language' has already been declared (1)[0-1]

SyntaxError: Identifier 'Language' has already been declared
```

### Root Cause

**GrayJay injects plugin scripts multiple times** during its lifecycle (e.g., when enabling/disabling, refreshing, or switching between sources). Each injection creates a new execution context, but our code was declaring global variables that would conflict on re-injection.

### What We Did Wrong (Initially)

```javascript
// ❌ WRONG - Causes duplicate declaration errors
var Hoster = {
  Unknown: "Unknown",
  VOE: "VOE",
  Doodstream: "Doodstream",
  // ...
};

var Language = {
  Unknown: "Unknown",
  German: "German",
  English: "English",
  // ...
};
```

**Why this failed:**
- Even with `var` (which allows redeclaration in normal JavaScript), GrayJay's script injection context doesn't allow redeclaring these object literals
- The error occurred on the second+ injection of the script
- Using `const` would have made it even worse

### What We Tried (That Didn't Work)

1. **Conditional Assignment Pattern:**
   ```javascript
   // ❌ Still failed
   var Hoster = Hoster || { ... };
   var Language = Language || { ... };
   ```
   This pattern didn't work because the variables are being declared in a fresh context each time.

2. **Changing to var:**
   ```javascript
   // ❌ Still failed
   var config = {};
   var Hoster = { ... };
   var Language = { ... };
   ```
   `var` allows redeclaration in normal JS, but not in GrayJay's injection context.

## The Solution

### What Actually Works

**Remove the enum objects entirely and use string literals:**

```javascript
// ✅ CORRECT - No declarations to conflict
function toLanguage(text) {
  text = text.toLowerCase();
  switch (text) {
    case "german":
    case "deutsch":
      return "German";  // Direct string literal
    case "english":
      return "English"; // Direct string literal
    default:
      return "Unknown"; // Direct string literal
  }
}

function toHoster(text) {
  text = text.toLowerCase();
  switch (text) {
    case "voe":
      return "VOE";      // Direct string literal
    case "doodstream":
      return "Doodstream"; // Direct string literal
    default:
      return "Unknown";   // Direct string literal
  }
}
```

### Configuration Variables

Changed mutable state from `var` to `let` (following GrayJay patterns):

```javascript
// Before:
var config = {};

// After:
let config = {}; // ✅ Follows GrayJay convention
```

## Key Learnings from Other Plugins

### What Successful Plugins Do

After analyzing working GrayJay plugins (Kick, DLive, Bitchute), we found:

1. **Use `const` for true constants:**
   ```javascript
   const PLATFORM = "Kick";
   const BASE_URL = "https://kick.com/";
   const USER_AGENT = "Mozilla/5.0 ...";
   ```

2. **Use `let` for mutable state:**
   ```javascript
   let config = {};
   let state = {};
   ```

3. **Don't declare enum-like objects:**
   - No plugins declare `var SomeEnum = { ... }` style objects
   - They use string literals directly or generate them dynamically
   - They use functions to map/transform values

4. **Minimize global scope pollution:**
   - Keep global declarations to absolute minimum
   - Use functions to encapsulate logic
   - Return values directly rather than referencing global enums

## Comparison: Before and After

### Before (Broken)
```javascript
// Declarations (causes issues on re-injection)
var Hoster = {
  Unknown: "Unknown",
  VOE: "VOE",
  Doodstream: "Doodstream",
};

var Language = {
  Unknown: "Unknown",
  German: "German",
  English: "English",
};

// Usage
return Hoster.VOE;
return Language.German;
return { audio: Language.Unknown, subtitle: null };
```

**Issues:**
- 18 lines of global declarations
- Re-injection causes "already declared" errors
- Variables pollute global scope unnecessarily

### After (Fixed)
```javascript
// No global enum declarations!

// Usage - direct string literals
return "VOE";
return "German";
return { audio: "Unknown", subtitle: null };
```

**Benefits:**
- ✅ No duplicate declaration errors
- ✅ Cleaner code
- ✅ Less global scope pollution
- ✅ Easier to maintain
- ✅ Follows GrayJay patterns

## Testing the Fix

### Steps to Verify

1. **Load the plugin** in GrayJay
2. **Enable it** - Should work without errors
3. **Disable and re-enable** - Tests re-injection
4. **Switch to another source and back** - Tests multiple injections
5. **Refresh the sources list** - Tests context recreation

### Expected Behavior

- ✅ No "Identifier 'X' has already been declared" errors
- ✅ Plugin loads successfully every time
- ✅ Search, browse, and episode listing work correctly
- ✅ No console errors or warnings

## Impact on Code

### Lines Changed
- **Removed:** 18 lines (enum declarations)
- **Modified:** ~15 lines (references to enums)
- **Net Change:** Cleaner, simpler code

### Functionality Impact
- ✅ **No functional changes** - Same behavior
- ✅ **No API changes** - Same public interface
- ✅ **Just internal implementation** - String literals instead of enum references

## Why This Pattern is Better

### Advantages

1. **Script Injection Safe**
   - No global state that can conflict
   - Works with multiple injections
   - No initialization order issues

2. **More Maintainable**
   - Less code to maintain
   - Clearer intent (direct values)
   - No indirection through enums

3. **Better Performance**
   - No object creation overhead
   - Direct string comparisons
   - Less memory usage

4. **Follows Standards**
   - Matches other GrayJay plugins
   - Uses established patterns
   - Easier for contributors

### When You Might Use Enums

Enums are fine in plugins when:
- They're **const** values that never change
- They're **strings or numbers**, not objects
- They're **truly constant** across the plugin lifecycle
- They're **simple primitives**:
  ```javascript
  const PLATFORM = "Aniworld"; // ✅ Fine
  const MAX_SEASONS = 10;      // ✅ Fine
  ```

But avoid:
```javascript
var MyEnum = { ... };  // ❌ Causes issues
const MyEnum = { ... }; // ❌ Still problematic with re-injection
```

## Summary

**The Fix:** Removed global enum object declarations and replaced all references with direct string literals.

**Why It Works:** No global state to conflict when GrayJay re-injects the script.

**Lesson Learned:** When writing GrayJay plugins, minimize global declarations and follow the patterns used by existing successful plugins.

---

## Related Changes

- **Aniworld Plugin:** Fixed locally
- **S.to Plugin:** Fixed and pushed to GitHub (commit b95b776)
- **Both plugins:** Now use identical safe patterns
