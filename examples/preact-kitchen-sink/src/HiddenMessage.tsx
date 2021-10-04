import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export type PropsType = {
  /**
   * Child component to show or hide.
   */
  children: ComponentChildren;
};
function HiddenMessage({ children }: PropsType) {
  const [showMessage, setShowMessage] = useState(false);
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={(e) => setShowMessage((e.target as HTMLInputElement).checked)}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  );
}

export { HiddenMessage };
