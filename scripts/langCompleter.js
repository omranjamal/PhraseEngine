export default {
    getCompletions: function (editor, session, pos, prefix, callback) {
        let line = session.getLine(pos.row).substr(0, pos.column);
        let tokens = line
            .replace(/\s+/ig, ' ')
            .split(' ');

        let tag_writing = tokens[tokens.length - 1][0] === '<';
        let tags = tokens.filter(token => (/^\<[a-z]{2,10}$/g).test(token));
        let tag = (tags[tags.length - 1] || '').substr(1);
        let attr_writing = !tag_writing && !!tag;

        let basics = ['id', 'class'];

        if (tag_writing) {
            callback(null, ([
                'sentence',
                'if',
                'or',
                'then',
                'this',
                'for',
                'else',
                'unless',
                'either',
                'select',
                'maybe',
                'br',
                'data',
                'ref',
                'spaceless',
                'text'
            ]).map(function (ea) {
                return { value: ea, score: 100, meta: "tag" }
            }));
        } else if (attr_writing) {
            callback(null, (({
                if: basics.concat(['condition']),
                or: basics,
                then: basics,
                this: basics,
                for: basics.concat(['value']),
                else: basics,
                unless: basics.concat(['condition']),
                either: basics,
                select: basics.concat(['key']),
                maybe: basics,
                data: basics.concat(['key']),
                ref: ['id'],
                spaceless: basics,
                text: basics
            }[tag]) || []).map(function (ea) {
                return { value: ea + '="', score: 100, meta: "attr" }
            }));
        }
    }
};