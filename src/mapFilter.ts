export default function mapFilter<FUNC>(
    map: {[key: string]: FUNC},
    keys: string[]
): {[key: string]: FUNC} {
    const n_map: {
        [key: string]: FUNC
    } = {};

    keys.forEach(key => n_map[key] = map[key]);

    return n_map;
}