module.exports = {
    collector: {
        name: 'cdp',
        options: { waitFor: 100 }
    },
    formatter: 'json',
    rules: {
        'disallowed-headers': 'warning',
        'lang-attribute': 'warning',
        'manifest-exists': 'warning',
        'manifest-file-extension': 'warning',
        'manifest-is-valid': 'warning',
        'no-friendly-error-pages': 'warning',
        'no-html-only-headers': 'warning',
        'no-protocol-relative-urls': 'warning',
        'x-content-type-options': 'warning'
    }
};
