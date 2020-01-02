import * as React from "react";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Panel } from "office-ui-fabric-react/lib/Panel";
import { SuppliersList } from "./SuppliersList";

const explanation =
  "This panel is non-modal: even when it's open, it allows interacting with content outside the panel.";

export interface ISuppliersListPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuppliersListPanel: React.FunctionComponent<ISuppliersListPanelProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Panel
      headerText="Suppliers List"
      isBlocking={false}
      isOpen={isOpen}
      onDismiss={() => onClose()}
      closeButtonAriaLabel="Close"
    >
      <SuppliersList />
    </Panel>
  );
};
