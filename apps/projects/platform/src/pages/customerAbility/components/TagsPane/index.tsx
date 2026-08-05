import Tags from './Tags';
import Pane from './Pane';

const InternalTags = Tags;
type InternalTagsPaneType = typeof Tags;

interface TagsType extends InternalTagsPaneType {
  Pane: typeof Pane;
}

const TagsPane: TagsType = InternalTags as TagsType;

TagsPane.Pane = Pane;

export { Pane };

export default TagsPane;