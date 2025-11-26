
// Two Sum //
{
  "problemId": "TWO_SUM",
  "language": "Cpp",
  "code": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int,int> mp;\n        for(int i=0;i<nums.size();i++){\n            int need = target - nums[i];\n            if(mp.count(need)) return {mp[need], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};",
  "status": "Pending"
}

{
  "problemId": "TWO_SUM",
  "language": "Javascript",
  "code": "class Solution {\n    twoSum(nums, target) {\n        const map = new Map();\n        for(let i=0;i<nums.length;i++){\n            const need = target - nums[i];\n            if(map.has(need)) return [map.get(need), i];\n            map.set(nums[i], i);\n        }\n    }\n}",
  "status": "Pending"
}

{
  "problemId": "TWO_SUM",
  "language": "Python",
  "code": "class Solution:\n    def twoSum(self, nums, target):\n        mp = {}\n        for i,v in enumerate(nums):\n            need = target - v\n            if need in mp: return [mp[need], i]\n            mp[v] = i",
  "status": "Pending"
}

// Contains Duplicate //

{
  "problemId": "CONTAINS_DUPLICATE",
  "language": "Cpp",
  "code": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> st;\n        for(int x: nums){ if(st.count(x)) return true; st.insert(x);} \n        return false;\n    }\n};",
  "status": "Pending"
}

{
  "problemId": "CONTAINS_DUPLICATE",
  "language": "Javascript",
  "code": "class Solution {\n    containsDuplicate(nums) {\n        const st = new Set();\n        for(const n of nums){ if(st.has(n)) return true; st.add(n);} \n        return false;\n    }\n}",
  "status": "Pending"
}

{
  "problemId": "CONTAINS_DUPLICATE",
  "language": "Python",
  "code": "class Solution:\n    def containsDuplicate(self, nums):\n        st = set()\n        for x in nums:\n            if x in st: return True\n            st.add(x)\n        return False",
  "status": "Pending"
}

// Product of Array Except Self //

{
  "problemId": "PRODUCT_EXCEPT_SELF",
  "language": "Cpp",
  "code": "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n=nums.size(); vector<int> res(n,1);\n        int pre=1;\n        for(int i=0;i<n;i++){ res[i]=pre; pre*=nums[i]; }\n        int suf=1;\n        for(int i=n-1;i>=0;i--){ res[i]*=suf; suf*=nums[i]; }\n        return res;\n    }\n};",
      "status": "Pending"
}

{
  "problemId": "PRODUCT_EXCEPT_SELF",
  "language": "Javascript",
  "code": "class Solution {\n    productExceptSelf(nums) {\n        const n=nums.length, res=new Array(n).fill(1)\n        let pre=1\n        for(let i=0;i<n;i++){ res[i]=pre; pre*=nums[i]; }\n        let suf=1\n        for(let i=n-1;i>=0;i--){ res[i]*=suf; suf*=nums[i]; }\n        return res\n    }\n}",
      "status": "Pending"
}

{
  "problemId": "PRODUCT_EXCEPT_SELF",
  "language": "Python",
  "code": "class Solution:\n    def productExceptSelf(self, nums):\n        n=len(nums)\n        res=[1]*n\n        pre=1\n        for i in range(n): res[i],pre = pre,pre*nums[i]\n        suf=1\n        for i in range(n-1,-1,-1): res[i],suf = res[i]*suf, suf*nums[i]\n        return res",
      "status": "Pending"
}

// Longest Consecutive Sequence //

{
  "problemId": "LONGEST_CONSECUTIVE",
  "language": "Cpp",
  "code": "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        unordered_set<int> st(nums.begin(), nums.end());\n        int best=0;\n        for(int x: st){\n            if(!st.count(x-1)){\n                int cur=x,len=1;\n                while(st.count(cur+1)){ cur++; len++; }\n                best=max(best,len);\n            }\n        }\n        return best;\n    }\n};",
  "status": "Pending"
}

{
  "problemId": "LONGEST_CONSECUTIVE",
  "language": "Javascript",
  "code": "class Solution {\n    longestConsecutive(nums) {\n        const st = new Set(nums)\n        let best=0\n        for(const x of st){\n            if(!st.has(x-1)){\n                let cur=x,len=1\n                while(st.has(cur+1)){ cur++; len++ }\n                best=Math.max(best,len)\n            }\n        }\n        return best\n    }\n}",
      "status": "Pending"
}

{
  "problemId": "LONGEST_CONSECUTIVE",
  "language": "Python",
  "code": "class Solution:\n    def longestConsecutive(self, nums):\n        st=set(nums)\n        best=0\n        for x in st:\n            if x-1 not in st:\n                cur=x; length=1\n                while cur+1 in st:\n                    cur+=1; length+=1\n                best=max(best,length)\n        return best",
      "status": "Pending"
}

// Valid Anagram //

{
  "problemId": "VALID_ANAGRAM",
  "language": "Cpp",
  "code": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if(s.size()!=t.size()) return false;\n        int cnt[26]={0};\n        for(char c:s) cnt[c-'a']++;\n        for(char c:t){ if(--cnt[c-'a']<0) return false; }\n        return true;\n    }\n};",
      "status": "Pending"
}

{
  "problemId": "VALID_ANAGRAM",
  "language": "Javascript",
  "code": "class Solution {\n    isAnagram(s, t) {\n        if(s.length!==t.length) return false;\n        const cnt = new Array(26).fill(0)\n        for(const c of s) cnt[c.charCodeAt(0)-97]++\n        for(const c of t){ if(--cnt[c.charCodeAt(0)-97] < 0) return false }\n        return true\n    }\n}",
    "status": "Pending"
}

{
  "problemId": "VALID_ANAGRAM",
  "language": "Python",
  "code": "class Solution:\n    def isAnagram(self, s, t):\n        if len(s)!=len(t): return False\n        cnt=[0]*26\n        for c in s: cnt[ord(c)-97]+=1\n        for c in t:\n            idx = ord(c)-97\n            cnt[idx]-=1\n            if cnt[idx] < 0: return False\n        return True",
      "status": "Pending"
}
