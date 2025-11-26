const treeAndLinkedListHelper = `
struct ListNode {
    int val; ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
struct TreeNode {
    int val; TreeNode *left; TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

ListNode* arrayToLinkedList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (size_t i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

vector<int> linkedListToArray(ListNode* head) {
    vector<int> result;
    ListNode* current = head;
    unordered_set<ListNode*> visited;
    while (current && visited.find(current) == visited.end()) {
        visited.insert(current);
        result.push_back(current->val);
        current = current->next;
        if (result.size() > 10000) break;
    }
    return result;
}

TreeNode* arrayToBinaryTree(const vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

vector<int> binaryTreeToArray(TreeNode* root) {
    if (!root) return {};
    vector<int> result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node) {
            result.push_back(node->val);
            q.push(node->left); q.push(node->right);
        } else {
            result.push_back(INT_MIN);
        }
    }
    while (!result.empty() && result.back() == INT_MIN) result.pop_back();
    return result;
}

void deleteLinkedList(ListNode* head) {
    unordered_set<ListNode*> visited;
    while (head && visited.find(head) == visited.end()) {
        visited.insert(head);
        ListNode* next = head->next;
        delete head;
        head = next;
    }
}
void deleteBinaryTree(TreeNode* root) {
    if (!root) return;
    deleteBinaryTree(root->left);
    deleteBinaryTree(root->right);
    delete root;
}
`;

const prepareCppCode = (code, input, metadata) => {
    // Helper function to check char arrays
    const shouldUseCharArray = (param, inputValue) => {
        if (param.type === 'charArray') return true;
        const charFunctions = ['taskscheduler', 'task', 'frequencysort'];
        if (charFunctions.some(p => metadata.name.toLowerCase().includes(p) || param.name.toLowerCase().includes(p))) {
            return Array.isArray(inputValue) && inputValue.every(i => typeof i === 'string' && i.length === 1);
        }
        return false;
    };

    const inputDeclarations = metadata.parameters.map((param, index) => {
        const inputValue = input[index];
        
        // 1. Handle Linked Lists
        if (param.type === 'linkedlist') {
            return `ListNode* ${param.name} = arrayToLinkedList({${inputValue.join(', ')}});`;
        } 
        // 2. Handle Binary Trees
        else if (param.type === 'binarytree' || param.type === 'tree') {
            const cppArr = inputValue.map(val => val === null ? 'INT_MIN' : val);
            return `TreeNode* ${param.name} = arrayToBinaryTree({${cppArr.join(', ')}});`;
        } 
        // 3. Handle Arrays (generic check for list/array types)
        else if (Array.isArray(inputValue)) {
            // 2D Array detection
            if (inputValue.length > 0 && Array.isArray(inputValue[0])) {
                const formatted2D = inputValue.map(row => `{${row.join(', ')}}`).join(', ');
                return `vector<vector<int>> ${param.name} = {${formatted2D}};`;
            } 
            // Char Array detection
            else if (shouldUseCharArray(param, inputValue)) {
                 const charValues = inputValue.map(str => `'${str}'`).join(', ');
                 return `vector<char> ${param.name} = {${charValues}};`;
            } 
            // String Array detection
            else if (inputValue.length > 0 && typeof inputValue[0] === 'string') {
                 const strs = inputValue.map(item => `"${item}"`).join(', ');
                 return `vector<string> ${param.name} = {${strs}};`;
            }
            // Default to vector<int>
             return `vector<int> ${param.name} = {${inputValue.join(', ')}};`;
        } 
        // 4. Primitives
        else if (typeof inputValue === 'string') {
            return `string ${param.name} = "${inputValue}";`;
        } else if (typeof inputValue === 'number') {
            return `int ${param.name} = ${inputValue};`;
        } 
        
        // Fallback
        return `auto ${param.name} = ${JSON.stringify(inputValue)};`;
    }).join('\n        ');

    const functionCall = `solution.${metadata.name}(${metadata.parameters.map(p => p.name).join(', ')})`;

    // Cleanup logic for parameters
    let cleanupCode = '';
    cleanupCode += metadata.parameters.filter(p => p.type === 'linkedlist').map(p => `deleteLinkedList(${p.name});`).join('\n        ');
    cleanupCode += metadata.parameters.filter(p => p.type === 'binarytree' || p.type === 'tree').map(p => `deleteBinaryTree(${p.name});`).join('\n        ');

    const wrapper = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <stack>
#include <queue>
#include <climits>
#include <cmath>
#include <iomanip>
using namespace std;
${treeAndLinkedListHelper}

// --- Universal Printer (Templates) ---

// Forward declarations
template <typename T> void printResult(const vector<T>& vec);
void printResult(int val) { cout << val; }
void printResult(long val) { cout << val; }
void printResult(double val) { cout << (val == floor(val) ? static_cast<long>(val) : val); }
void printResult(float val) { cout << (val == floor(val) ? static_cast<long>(val) : val); }
void printResult(const string& val) { cout << val; }
void printResult(bool val) { cout << (val ? "true" : "false"); }
void printResult(char val) { cout << "\"" << val << "\""; }
void printResult(ListNode* head) { vector<int> arr = linkedListToArray(head); printResult(arr); }
void printResult(TreeNode* root) { vector<int> arr = binaryTreeToArray(root); printResult(arr); }

// Template for Vectors (Handles 1D, 2D, 3D automatically)
template <typename T>
void printResult(const vector<T>& vec) {
    for (size_t i = 0; i < vec.size(); i++) {
        printResult(vec[i]); 
        if (i < vec.size() - 1) cout << ",";
    }
}

// --- Universal Cleanup (Overloading) ---
// These overloads replace 'if constexpr' for C++11/14 compatibility
void cleanupResult(ListNode* head) { deleteLinkedList(head); }
void cleanupResult(TreeNode* root) { deleteBinaryTree(root); }
template <typename T> void cleanupResult(T val) { /* no-op for non-pointers */ }


${code}

int main() {
    try {
        Solution solution;
        ${inputDeclarations}
        
        auto result = ${functionCall};
        
        // Print result
        printResult(result);
        cout << endl;
        
        // Cleanup inputs
        ${cleanupCode}
        
        // Cleanup result using overloading (works on old compilers)
        cleanupResult(result);
        
    } catch (const exception& e) {
        cerr << "Runtime Error: " << e.what() << endl;
        return 1;
    }
    return 0;
}
`;
    return wrapper;
};

module.exports = prepareCppCode;