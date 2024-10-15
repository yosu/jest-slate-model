export const EmbModel = {
  decode: (emb) => {
    const selection = {};
    const decoded = EmbModel._decodeChildren(emb, [], selection);

    return {
      children: decoded,
      selection: 'anchor' in selection ? selection : null,
    };
  },
  _decodeChildren: (children, path, selection) => {
    return children.map((ch, i) => EmbModel._decodeChild(ch, [...path, i], selection));
  },
  _decodeChild: (ch, path, selection) => {
    const res = {...ch};
    if ('children' in res) {
      res.children = EmbModel._decodeChildren(res.children, path, selection);
    }

    if (!('text' in ch))
      return res;

    EmbModel._decodeSelection(res, path, selection, 'cursor');
    if ('cursor' in selection) {
      selection['anchor'] = selection['cursor'];
      selection['focus'] = selection['cursor'];
      delete selection['cursor'];
      return res;
    }

    const anchorOffset = res.text.indexOf('<anchor>');
    const focusOffset = res.text.indexOf('<focus>');

    // f anchor and focus are in same text
    if (anchorOffset !== -1 && focusOffset !== -1) {
      // replace the nearest keyword first
      if (anchorOffset < focusOffset) {
        EmbModel._decodeSelection(res, path, selection, 'anchor');
        EmbModel._decodeSelection(res, path, selection, 'focus');
        return res;
      }
    }

    EmbModel._decodeSelection(res, path, selection, 'focus');
    EmbModel._decodeSelection(res, path, selection, 'anchor');

    return res;
  },
  _decodeSelection: (ch, path, selection, target) => {
    const keyword = `<${target}>`;
    const text = ch.text;
    const offset = ch.text.indexOf(keyword);
    if (offset !== -1) {
      // remove the keyword string from 'text' property
      ch["text"] = text.slice(0, offset) + text.slice(offset + keyword.length, text.length);
      // console.log(offset, offset + keyword.length, ch['text']);
      selection[target] = { path, offset }
    }
  },
  encode: (editor) => {
    // TODO: implement
  }
}
