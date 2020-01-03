import * as React from "react";
import { Panel } from "office-ui-fabric-react";
import { SuppliersList } from "./SuppliersList";

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
