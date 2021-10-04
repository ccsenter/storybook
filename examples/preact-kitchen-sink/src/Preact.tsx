import { h, Component } from 'preact';
import { useState } from 'preact/hooks';

export type Props = {
  /**
   * Label property
   */
  label: string;
};

export function PreactFunctionalComponent({ label }: Props) {
  const [clicks, setValue] = useState(0);
  return (
    <div
      tabIndex={0}
      onClick={() => setValue(clicks + 1)}
      style={{ cursor: 'pointer' }}
      onKeyDown={() => undefined}
      role="button"
    >
      <div style={{ color: 'red' }}>{label}</div>
      <div>Clicked {clicks} times.</div>
    </div>
  );
};

/**
 * Pure preact based component sample.
 */
export class PreactClassComponent extends Component<Props> {
  state = {
    clicks: 0,
  };

  render() {
    const { label } = this.props;
    const { clicks } = this.state;
    return (
      <div
        tabIndex={0}
        onClick={() => this.setState({ clicks: clicks + 1 })}
        onKeyDown={() => undefined}
        style={{ cursor: 'pointer' }}
        role="button"
      >
        <div style={{ color: 'green' }}>{label}</div>
        <div>Clicked {clicks} times.</div>
      </div>
    );
  }
}
