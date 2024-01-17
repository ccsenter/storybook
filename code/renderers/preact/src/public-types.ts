import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations,
} from '@storybook/types';
import type { ComponentProps, ComponentType, JSXElementConstructor } from 'react';
import type { SetOptional, Simplify } from 'type-fest';
import type { PreactRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/types';
export type { PreactRenderer };

type JSXElement = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TCmpOrArgs = Args> = [TCmpOrArgs] extends [ComponentType<any>]
  ? ComponentAnnotations<PreactRenderer, ComponentProps<TCmpOrArgs>>
  : ComponentAnnotations<PreactRenderer, TCmpOrArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TCmpOrArgs = Args> = [TCmpOrArgs] extends [ComponentType<any>]
  ? AnnotatedStoryFn<PreactRenderer, ComponentProps<TCmpOrArgs>>
  : AnnotatedStoryFn<PreactRenderer, TCmpOrArgs>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TMetaOrCmpOrArgs = Args> = [TMetaOrCmpOrArgs] extends [
  {
    render?: ArgsStoryFn<PreactRenderer, any>;
    component?: infer Component;
    args?: infer DefaultArgs;
  },
]
  ? Simplify<
      (Component extends ComponentType<any> ? ComponentProps<Component> : unknown) &
        ArgsFromMeta<PreactRenderer, TMetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        PreactRenderer,
        AddMocks<TArgs, DefaultArgs>,
        SetOptional<TArgs, keyof TArgs & keyof (DefaultArgs & ActionArgs<TArgs>)>
      >
    : never
  : TMetaOrCmpOrArgs extends ComponentType<any>
    ? StoryAnnotations<PreactRenderer, ComponentProps<TMetaOrCmpOrArgs>>
    : StoryAnnotations<PreactRenderer, TMetaOrCmpOrArgs>;

// This performs a downcast to function types that are mocks, when a mock fn is given to meta args.
type AddMocks<TArgs, DefaultArgs> = Simplify<{
  [T in keyof TArgs]: T extends keyof DefaultArgs
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      DefaultArgs[T] extends (...args: any) => any & { mock: {} } // allow any function with a mock object
      ? DefaultArgs[T]
      : TArgs[T]
    : TArgs[T];
}>;

type ActionArgs<TArgs> = {
  // This can be read as: filter TArgs on functions where we can assign a void function to that function.
  // The docs addon argsEnhancers can only safely provide a default value for void functions.
  // Other kind of required functions should be provided by the user.
  [P in keyof TArgs as TArgs[P] extends (...args: any[]) => any
    ? ((...args: any[]) => void) extends TArgs[P]
      ? P
      : never
    : never]: TArgs[P];
};

/**
 * @deprecated Use `Meta` instead, e.g. ComponentMeta<typeof Button> -> Meta<typeof Button>.
 *
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<T extends JSXElement> = Meta<ComponentProps<T>>;

/**
 * @deprecated Use `StoryFn` instead, e.g. ComponentStoryFn<typeof Button> -> StoryFn<typeof Button>.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories.
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/
 *
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStoryFn<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStoryFn<T extends JSXElement> = StoryFn<ComponentProps<T>>;

/**
 * @deprecated Use `StoryObj` instead, e.g. ComponentStoryObj<typeof Button> -> StoryObj<typeof Button>.
 *
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStoryObj<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStoryObj<T extends JSXElement> = StoryObj<ComponentProps<T>>;

/**
 * @deprecated Use `StoryFn` instead.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories.
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/
 *
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryFn<TArgs>;

/**
 * @deprecated Use `StoryFn` instead, e.g. ComponentStory<typeof Button> -> StoryFn<typeof Button>.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/.
 *
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStory<T extends JSXElement> = ComponentStoryFn<T>;

/**
 * @deprecated Use Decorator instead.
 */
export type DecoratorFn = DecoratorFunction<PreactRenderer>;
export type Decorator<TArgs = StrictArgs> = DecoratorFunction<PreactRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<PreactRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<PreactRenderer, TArgs>;
export type Preview = ProjectAnnotations<PreactRenderer>;
