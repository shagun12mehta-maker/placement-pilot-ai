export const TRACKS = [
  {
    id: 'mass-recruiter',
    name: 'TCS / Infosys / Wipro (Mass IT Recruiter)',
    description: 'Core Data Structures, OOPs concepts, basic algorithms, and verbal communication.',
    defaultRole: 'Graduate Trainee / Software Engineer',
    questions: [
      {
        id: 'mr-1',
        title: 'Two Sum & Array Optimization',
        difficulty: 'Easy',
        topic: 'Arrays & Hash Maps',
        prompt: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Constraints:
- 2 <= nums.length <= 10^4
- Only one valid answer exists.
- You may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1] (Because nums[0] + nums[1] == 9)`,
        starterCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        testCases: [
          { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { args: [[3, 2, 4], 6], expected: [1, 2] },
          { args: [[3, 3], 6], expected: [0, 1] }
        ],
        expectedComplexity: 'Time: O(n), Space: O(n)',
        hrFollowUp: 'Tell me about a time you had to learn a completely new programming language or framework within a short deadline.'
      },
      {
        id: 'mr-2',
        title: 'Reverse String In-Place',
        difficulty: 'Easy',
        topic: 'Two Pointers & Arrays',
        prompt: `Write a function that reverses a string given as an array of characters in-place.

Constraints:
- You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]`,
        starterCode: `function solution(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    let temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  return s;
}`,
        testCases: [
          { args: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] },
          { args: [["H","a","n","n","a","h"]], expected: ["h","a","n","n","a","H"] }
        ],
        expectedComplexity: 'Time: O(n), Space: O(1)',
        hrFollowUp: 'Why do you want to join our company, and how do you handle repetitive tasks under tight client deadlines?'
      }
    ]
  },
  {
    id: 'product-bigtech',
    name: 'Amazon / Big Tech (Tier-1 Product)',
    description: 'Rigorous SDE-1 interviews testing space-time trade-offs, edge-case vulnerability, and STAR behavioral answers.',
    defaultRole: 'Software Development Engineer I (SDE-1)',
    questions: [
      {
        id: 'p-1',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        topic: 'Sliding Window & Hash Sets',
        prompt: `Given a string s, find the length of the longest substring without repeating characters.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.

Example:
Input: s = "abcabcbb"
Output: 3 (The answer is "abc")`,
        starterCode: `function lengthOfLongestSubstring(s) {
  let set = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
        testCases: [
          { args: ["abcabcbb"], expected: 3 },
          { args: ["bbbbb"], expected: 1 },
          { args: ["pwwkew"], expected: 3 }
        ],
        expectedComplexity: 'Time: O(n), Space: O(min(m, n))',
        hrFollowUp: 'Describe a situation where you had a disagreement with a peer or teammate on technical design. How did you resolve it?'
      }
    ]
  }
];
