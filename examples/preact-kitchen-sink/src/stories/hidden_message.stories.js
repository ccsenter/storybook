/** @jsx h */

import { h } from 'preact';
import { HiddenMessage } from '../HiddenMessage';

export default {
  component: HiddenMessage,
  title: 'Hidden Message',
};

const Template = (args) => <HiddenMessage>{args.children}</HiddenMessage>;

export const Primary = Template.bind({});

Primary.args = {
  children: 'Hi from Storybook!',
};
