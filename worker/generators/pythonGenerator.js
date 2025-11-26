// const treeAndLinkedListHelper = `
// # ListNode definition for linked list problems
// class ListNode:
//     def __init__(self, val=0, next=None):
//         self.val = val
//         self.next = next
//     def __repr__(self): return f"ListNode({self.val})"

// class TreeNode:
//     def __init__(self, val=0, left=None, right=None):
//         self.val = val
//         self.left = left
//         self.right = right
//     def __repr__(self): return f"TreeNode({self.val})"

// def array_to_linked_list(arr):
//     if not arr: return None
//     head = ListNode(arr[0])
//     current = head
//     for i in range(1, len(arr)):
//         current.next = ListNode(arr[i])
//         current = current.next
//     return head

// def linked_list_to_array(head):
//     result = []
//     current = head
//     visited = set()
//     while current and current not in visited:
//         visited.add(current)
//         result.append(current.val)
//         current = current.next
//         if len(result) > 10000: break
//     return result

// def array_to_binary_tree(arr):
//     if not arr or arr[0] is None: return None
//     root = TreeNode(arr[0])
//     queue = [root]
//     i = 1
//     while queue and i < len(arr):
//         node = queue.pop(0)
//         if i < len(arr) and arr[i] is not None:
//             node.left = TreeNode(arr[i])
//             queue.append(node.left)
//         i += 1
//         if i < len(arr) and arr[i] is not None:
//             node.right = TreeNode(arr[i])
//             queue.append(node.right)
//         i += 1
//     return root

// def binary_tree_to_array(root):
//     if not root: return []
//     result = []
//     queue = [root]
//     while queue:
//         node = queue.pop(0)
//         if node:
//             result.append(node.val)
//             queue.append(node.left)
//             queue.append(node.right)
//         else:
//             result.append(None)
//     while result and result[-1] is None: result.pop()
//     return result
// `;

// const toPythonValue = (value) => {
//     if (value === null) return 'None';
//     if (Array.isArray(value)) {
//         return '[' + value.map(toPythonValue).join(', ') + ']';
//     }
//     if (typeof value === 'string') {
//         return `"${value}"`;
//     }
//     return String(value);
// };

// const preparePythonCode = (code, input, metadata) => {
//     const inputAssignments = metadata.parameters
//         .map((param, index) => {
//             const inputValue = input[index];
//             if (param.type === 'linkedlist') {
//                 return `        ${param.name} = array_to_linked_list(${toPythonValue(inputValue)})`;
//             } else if (param.type === 'binarytree' || param.type === 'tree') {
//                 return `        ${param.name} = array_to_binary_tree(${toPythonValue(inputValue)})`;
//             } else {
//                 return `        ${param.name} = ${toPythonValue(inputValue)}`;
//             }
//         })
//         .join('\n');

//     const functionCall = `solution.${metadata.name}(${metadata.parameters.map(p => p.name).join(', ')})`;
//     const hasLinkedListReturn = metadata.returnType === 'linkedlist';

//     const wrapper = `
// import sys
// import json
// ${treeAndLinkedListHelper}

// # User's solution code
// ${code}

// def main():
//     try:
//         solution = Solution()
// ${inputAssignments}
//         result = ${functionCall}
//         ${hasLinkedListReturn ? `if isinstance(result, ListNode): result = linked_list_to_array(result)` : ''}
//         if hasattr(result, 'val') and hasattr(result, 'left') and hasattr(result, 'right'):
//             result = binary_tree_to_array(result)
        
//         if isinstance(result, list):
//             if result and isinstance(result[0], list):
//                 flattened = []
//                 for sublist in result: flattened.extend(sublist)
//                 print(','.join(map(str, flattened)))
//             else:
//                 print(','.join(map(str, result)))
//         elif isinstance(result, bool):
//             print(str(result).lower())
//         elif isinstance(result, float):
//             print(int(result) if result.is_integer() else result)
//         else:
//             print(result)
            
//     except Exception as e:
//         print(f"Runtime Error: {str(e)}", file=sys.stderr)
//         sys.exit(1)

// if __name__ == "__main__":
//     main()
// `;
//     return wrapper;
// };

// module.exports = preparePythonCode;

const treeAndLinkedListHelper = `
# ListNode definition for linked list problems
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self): return f"ListNode({self.val})"

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self): return f"TreeNode({self.val})"

def array_to_linked_list(arr):
    if not arr: return None
    head = ListNode(arr[0])
    current = head
    for i in range(1, len(arr)):
        current.next = ListNode(arr[i])
        current = current.next
    return head

def linked_list_to_array(head):
    result = []
    current = head
    visited = set()
    while current and current not in visited:
        visited.add(current)
        result.append(current.val)
        current = current.next
        if len(result) > 10000: break
    return result

def array_to_binary_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def binary_tree_to_array(root):
    if not root: return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None: result.pop()
    return result
`;

const toPythonValue = (value) => {
    if (value === null) return 'None';
    if (Array.isArray(value)) {
        return '[' + value.map(toPythonValue).join(', ') + ']';
    }
    if (typeof value === 'string') {
        return `"${value}"`;
    }
    return String(value);
};

const preparePythonCode = (code, input, metadata) => {
    const inputAssignments = metadata.parameters
        .map((param, index) => {
            const inputValue = input[index];
            if (param.type === 'linkedlist') {
                return `        ${param.name} = array_to_linked_list(${toPythonValue(inputValue)})`;
            } else if (param.type === 'binarytree' || param.type === 'tree') {
                return `        ${param.name} = array_to_binary_tree(${toPythonValue(inputValue)})`;
            } else {
                return `        ${param.name} = ${toPythonValue(inputValue)}`;
            }
        })
        .join('\n');

    const functionCall = `solution.${metadata.name}(${metadata.parameters.map(p => p.name).join(', ')})`;

    const wrapper = `
import sys
import json
${treeAndLinkedListHelper}

# User's solution code
${code}

# --- NEW HELPER: Recursively converts Nodes to Arrays ---
def serialize_result(item):
    if item is None:
        return None
    # Handle ListNode
    if isinstance(item, ListNode):
        return linked_list_to_array(item)
    # Handle TreeNode
    if isinstance(item, TreeNode):
        return binary_tree_to_array(item)
    # Handle List (Recursively)
    if isinstance(item, list):
        return [serialize_result(sub) for sub in item]
    return item

def main():
    try:
        solution = Solution()
${inputAssignments}
        raw_result = ${functionCall}
        
        # Convert any ListNodes/TreeNodes to arrays automatically
        result = serialize_result(raw_result)
        
        # Output Formatting
        if isinstance(result, list):
            # Flatten logic for consistency with previous JS behavior if nested
            if result and isinstance(result[0], list):
                flattened = []
                for sublist in result: flattened.extend(sublist)
                print(','.join(map(str, flattened)))
            else:
                print(','.join(map(str, result)))
        elif isinstance(result, bool):
            print(str(result).lower())
        elif isinstance(result, float):
            print(int(result) if result.is_integer() else result)
        else:
            print(result)
            
    except Exception as e:
        print(f"Runtime Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
`;
    return wrapper;
};

module.exports = preparePythonCode;