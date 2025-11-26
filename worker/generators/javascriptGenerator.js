// const treeAndLinkedListHelper = `
// class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }
// class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// function arrayToLinkedList(arr) {
//     if (!arr || arr.length === 0) return null;
//     const head = new ListNode(arr[0]);
//     let current = head;
//     for (let i = 1; i < arr.length; i++) {
//         current.next = new ListNode(arr[i]);
//         current = current.next;
//     }
//     return head;
// }

// function linkedListToArray(head) {
//     const result = [];
//     let current = head;
//     const visited = new Set();
//     while (current && !visited.has(current)) {
//         visited.add(current);
//         result.push(current.val);
//         current = current.next;
//         if (result.length > 10000) break;
//     }
//     return result;
// }

// function arrayToBinaryTree(arr) {
//     if (!arr || arr.length === 0 || arr[0] === null) return null;
//     const root = new TreeNode(arr[0]);
//     const queue = [root];
//     let i = 1;
//     while (queue.length > 0 && i < arr.length) {
//         const node = queue.shift();
//         if (i < arr.length && arr[i] !== null) {
//             node.left = new TreeNode(arr[i]);
//             queue.push(node.left);
//         }
//         i++;
//         if (i < arr.length && arr[i] !== null) {
//             node.right = new TreeNode(arr[i]);
//             queue.push(node.right);
//         }
//         i++;
//     }
//     return root;
// }

// function binaryTreeToArray(root) {
//     if (!root) return [];
//     const result = [];
//     const queue = [root];
//     while (queue.length > 0) {
//         const node = queue.shift();
//         if (node) {
//             result.push(node.val);
//             queue.push(node.left);
//             queue.push(node.right);
//         } else {
//             result.push(null);
//         }
//     }
//     while (result.length > 0 && result[result.length - 1] === null) result.pop();
//     return result;
// }
// `;

// const prepareJavascriptCode = (code, input, metadata) => {
//     const inputAssignments = metadata.parameters
//         .map((param, index) => {
//             const inputValue = input[index];
//             if (param.type === 'linkedlist') {
//                 return `        const ${param.name} = arrayToLinkedList(${JSON.stringify(inputValue)});`;
//             } else if (param.type === 'binarytree' || param.type === 'tree') {
//                 return `        const ${param.name} = arrayToBinaryTree(${JSON.stringify(inputValue)});`;
//             } else {
//                 return `        const ${param.name} = ${JSON.stringify(inputValue)};`;
//             }
//         })
//         .join('\n');
    
//     const functionCall = `solution.${metadata.name}(${metadata.parameters.map(p => p.name).join(', ')})`;
//     const hasLinkedListReturn = metadata.returnType === 'linkedlist';

//     const wrapper = `
// ${treeAndLinkedListHelper}

// // User's solution code
// ${code}

// function main() {
//     try {
//         const solution = new Solution();
// ${inputAssignments}
//         let result = ${functionCall};
//         ${hasLinkedListReturn ? `if (result && typeof result === 'object' && 'val' in result) result = linkedListToArray(result);` : ''}
//         if (result && typeof result === 'object' && 'val' in result && 'left' in result) result = binaryTreeToArray(result);
        
//         if (Array.isArray(result)) {
//             if (result.length > 0 && Array.isArray(result[0])) {
//                 console.log(result.flat().join(','));
//             } else {
//                 console.log(result.join(','));
//             }
//         } else {
//             console.log(result);
//         }
//     } catch (error) {
//         console.error(\`Runtime Error: \${error.message}\`);
//         process.exit(1);
//     }
// }
// main();
// `;
//     return wrapper;
// };

// module.exports = prepareJavascriptCode;

const treeAndLinkedListHelper = `
class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

function arrayToLinkedList(arr) {
    if (!arr || arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function linkedListToArray(head) {
    const result = [];
    let current = head;
    const visited = new Set();
    while (current && !visited.has(current)) {
        visited.add(current);
        result.push(current.val);
        current = current.next;
        if (result.length > 10000) break;
    }
    return result;
}

function arrayToBinaryTree(arr) {
    if (!arr || arr.length === 0 || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function binaryTreeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    while (result.length > 0 && result[result.length - 1] === null) result.pop();
    return result;
}
`;

const prepareJavascriptCode = (code, input, metadata) => {
    const inputAssignments = metadata.parameters
        .map((param, index) => {
            const inputValue = input[index];
            if (param.type === 'linkedlist') {
                return `        const ${param.name} = arrayToLinkedList(${JSON.stringify(inputValue)});`;
            } else if (param.type === 'binarytree' || param.type === 'tree') {
                return `        const ${param.name} = arrayToBinaryTree(${JSON.stringify(inputValue)});`;
            } else {
                return `        const ${param.name} = ${JSON.stringify(inputValue)};`;
            }
        })
        .join('\n');
    
    const functionCall = `solution.${metadata.name}(${metadata.parameters.map(p => p.name).join(', ')})`;

    // New wrapper with dynamic result serialization
    const wrapper = `
${treeAndLinkedListHelper}

// User's solution code
${code}

// --- NEW HELPER: Recursively converts Nodes to Arrays ---
function serializeResult(item) {
    // Handle null/undefined
    if (item === null || item === undefined) return item;

    // Detect Linked List (has 'val' and 'next')
    if (typeof item === 'object' && 'val' in item && 'next' in item) {
        return linkedListToArray(item);
    }

    // Detect Binary Tree (has 'val', 'left', 'right')
    if (typeof item === 'object' && 'val' in item && 'left' in item && 'right' in item) {
        return binaryTreeToArray(item);
    }

    // Detect Array (Recursively process elements)
    if (Array.isArray(item)) {
        return item.map(serializeResult);
    }

    // Return primitive values as is
    return item;
}

function main() {
    try {
        const solution = new Solution();
${inputAssignments}
        
        // Execute user code
        const rawResult = ${functionCall};
        
        // Convert any ListNodes/TreeNodes to arrays automatically
        const result = serializeResult(rawResult);
        
        // Output Formatting
        if (Array.isArray(result)) {
            // If result is a matrix or array of lists (e.g. [[1,2], [3,4]]), flatten for output
            // based on the "Expected: 5,4,3,2,1" format from your error log.
            if (result.length > 0 && Array.isArray(result[0])) {
                console.log(result.flat().join(','));
            } else {
                console.log(result.join(','));
            }
        } else {
            console.log(result);
        }
    } catch (error) {
        console.error(\`Runtime Error: \${error.message}\`);
        process.exit(1);
    }
}
main();
`;
    return wrapper;
};

module.exports = prepareJavascriptCode;