import type { ImportedCSSModule } from '../datagrid/createStyleElement';
import * as React from 'react';
import { memo } from 'react';

function Style(props: { cssModule: ImportedCSSModule }) {
  const { cssModule } = props;
  return <style>{cssModule.toString()}</style>;
}

export default memo(Style);
