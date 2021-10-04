/** @jsx h */
import { h } from 'preact';
import { PreactFunctionalComponent, PreactClassComponent } from '../Preact';

export default {
  title: 'Pure Preact Components',
};

export const PreactComponentDemo = () => (
  <div>
    <h1>Preact component demo</h1>
    <PreactFunctionalComponent label="This is a Preact functional component" />
    <hr />
    <PreactClassComponent label="This is a Preact class component" />
  </div>
);
