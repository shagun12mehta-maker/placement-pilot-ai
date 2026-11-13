export const TRACKS = [
  {
    id: 'mass-recruiter',
    name: 'TCS / Infosys / Wipro (Mass IT Recruiter)',
    description: 'Focuses on Core Data Structures, OOPs concepts, basic algorithms, and verbal communication.',
    defaultRole: 'Graduate Trainee / Software Engineer',
    questions: [
      {
        id: 'mr-1',
        title: 'Two Sum & Array Optimization',
        difficulty: 'Easy',
        topic: 'Arrays & Hash Maps',
        prompt: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Can you first explain the brute-force approach, and then optimize it to O(n) time?',
        starterCode: `// Language: JavaScript / TypeScript
function twoSum(nums, target) {
  // Explain your logic verbally as you write:
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
        expectedComplexity: 'Time: O(n), Space: O(n)',
        hrFollowUp: 'Tell me about a time you had to learn a completely new programming language or framework within a short deadline.'
      },
      {
        id: 'mr-2',
        title: 'Reverse Linked List & Pointer Logic',
        difficulty: 'Medium-Easy',
        topic: 'Linked Lists & Pointers',
        prompt: 'Given the head of a singly linked list, reverse the list iteratively and return the reversed list. Explain step-by-step how the pointer reassignments work without losing references.',
        starterCode: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
        expectedComplexity: 'Time: O(n), Space: O(1)',
        hrFollowUp: 'Why do you want to join our company, and how do you handle repetitive debugging tasks under tight client deadlines?'
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
        prompt: 'Given a string s, find the length of the longest substring without repeating characters. Walk me through your sliding window pointer movement and explain worst-case time complexity.',
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
        expectedComplexity: 'Time: O(n), Space: O(min(m, n))',
        hrFollowUp: 'Describe a situation where you had a disagreement with a peer or teammate on technical design. How did you resolve it?'
      },
      {
        id: 'p-2',
        title: 'LRU Cache Design & Trade-offs',
        difficulty: 'Hard-Medium',
        topic: 'System Design & Hash Maps + Doubly Linked List',
        prompt: 'Design an LRU (Least Recently Used) cache with get(key) and put(key, value) operations running in O(1) average time. Explain why a standard array or single hash map fails to achieve O(1) eviction.',
        starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Refresh recency
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}`,
        expectedComplexity: 'Get: O(1), Put: O(1)',
        hrFollowUp: 'Tell me about a project that failed or went significantly off schedule. What was your retrospective analysis?'
      }
    ]
  },
  {
    id: 'startup-fintech',
    name: 'High-Growth Tech Startup / FinTech',
    description: 'Fast-paced, high-ownership engineering: practical API design, concurrency, resilience, and debugging.',
    defaultRole: 'Full-Stack / Backend Engineer',
    questions: [
      {
        id: 's-1',
        title: 'Rate Limiter & Concurrency Edge Cases',
        difficulty: 'Medium',
        topic: 'Concurrency & Token Bucket Algorithm',
        prompt: 'Design a high-throughput API rate limiter that allows a maximum of 100 requests per minute per IP address. How do you prevent race conditions during high concurrent traffic spikes?',
        starterCode: `class TokenBucketRateLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false; // Rate limit exceeded
  }

  refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRate);
    this.lastRefill = now;
  }
}`,
        expectedComplexity: 'Time: O(1) amortized, Space: O(U) where U is unique users',
        hrFollowUp: 'Startups require managing ambiguity. Tell me about a time you built a feature without clear requirements.'
      }
    ]
  }
];
