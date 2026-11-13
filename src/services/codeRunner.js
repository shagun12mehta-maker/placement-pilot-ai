/**
 * Safe client-side JavaScript execution engine.
 * Captures console.log and evaluates test cases in an isolated function scope.
 */
export async function executeCode(userCode, testCases = []) {
  const logs = [];
  const startTime = performance.now();

  // Custom console interceptor
  const customConsole = {
    log: (...args) => {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') {
          try { return JSON.stringify(arg); } catch (_) { return String(arg); }
        }
        return String(arg);
      }).join(' '));
    },
    error: (...args) => logs.push('[ERROR] ' + args.join(' ')),
    warn: (...args) => logs.push('[WARN] ' + args.join(' '))
  };

  try {
    // Wrap code and capture console
    const wrappedCode = `
      "use strict";
      const console = arguments[0];
      ${userCode}
      return {
        twoSum: typeof twoSum !== 'undefined' ? twoSum : undefined,
        reverseList: typeof reverseList !== 'undefined' ? reverseList : undefined,
        lengthOfLongestSubstring: typeof lengthOfLongestSubstring !== 'undefined' ? lengthOfLongestSubstring : undefined,
        solution: typeof solution !== 'undefined' ? solution : undefined
      };
    `;

    const runner = new Function(wrappedCode);
    const exports = runner(customConsole);

    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

    // Run test cases if provided
    const testResults = [];
    if (testCases && testCases.length > 0) {
      const targetFn = exports.twoSum || exports.reverseList || exports.lengthOfLongestSubstring || exports.solution;

      if (typeof targetFn === 'function') {
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          try {
            const actual = targetFn(...tc.args);
            const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
            testResults.push({
              index: i + 1,
              input: JSON.stringify(tc.args),
              expected: JSON.stringify(tc.expected),
              actual: JSON.stringify(actual),
              passed
            });
          } catch (tcErr) {
            testResults.push({
              index: i + 1,
              input: JSON.stringify(tc.args),
              expected: JSON.stringify(tc.expected),
              actual: 'Runtime Error: ' + tcErr.message,
              passed: false
            });
          }
        }
      }
    }

    return {
      success: true,
      logs,
      executionTimeMs,
      testResults
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      logs,
      executionTimeMs: 0,
      testResults: []
    };
  }
}
