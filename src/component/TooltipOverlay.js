import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const TooltipOverlay = ({ id, children, title, titleStyle="text-center" }) => (
    <OverlayTrigger overlay={<Tooltip id={id}><div className={titleStyle} dangerouslySetInnerHTML={{ __html: title}} /></Tooltip>}>
      <span>{children}</span>
    </OverlayTrigger>
);

export default TooltipOverlay;