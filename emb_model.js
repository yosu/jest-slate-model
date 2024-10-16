import { Path } from "slate";

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
    const { children, selection } = editor;

    if (selection === null)
      return children;

    const { anchor, focus } = selection;
    if (!Path.equals(anchor.path, focus.path)) {
      const encoded = EmbModel._encodeChildren([...children], [...anchor.path], anchor.offset, '<anchor>');
      return EmbModel._encodeChildren(encoded, [...focus.path], focus.offset, '<focus>');
    }

    if (anchor.offset < focus.offset) {
      const encoded = EmbModel._encodeChildren([...children], [...anchor.path], anchor.offset, '<anchor>');
      // adjust offset
      return EmbModel._encodeChildren(encoded, [...focus.path], focus.offset + '<anchor>'.length, '<focus>');
    } else if( anchor.offset > focus.offset ) {
      const encoded = EmbModel._encodeChildren([...children], [...focus.path], focus.offset, '<focus>');
      // adjust offset
      return EmbModel._encodeChildren(encoded, [...anchor.path], anchor.offset + '<focus>'.length, '<anchor>');
    } else {
      const { path, offset } = anchor;

      return EmbModel._encodeChildren([...children], [...path], offset, '<cursor>');
    }
  },
  _encodeChildren: (children, path, offset, keyword) => {
    const [i, ...nextPath] = path;
    if (nextPath.length === 0) {
      children[i] = EmbModel._encodeChild(children[i], offset, keyword)
      return children;
    }

    const next = {...children[i]};
    next["children"] = EmbModel._encodeChildren([...next.children], nextPath, offset, keyword);
    children[i] = next;

    return children;
  },
  _encodeChild: (ch, offset, keyword) => {
    const node = {...ch};
    const { text } = node;
    node["text"] = text.slice(0, offset) + keyword + text.slice(offset, + text.length);
    return node;
  }
}
