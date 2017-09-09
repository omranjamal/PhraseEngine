export default function peek<TYPE>(arr: TYPE[]): TYPE {
    return arr[arr.length - 1];
}