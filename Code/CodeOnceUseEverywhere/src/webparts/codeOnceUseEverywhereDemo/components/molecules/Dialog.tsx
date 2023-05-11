import * as React from "react";
import { FormView } from "../../../../models/models";
import HOOIcon from "@n8d/htwoo-react/HOOIcon";

export interface IDialogProps {
  visability: boolean;
  title: string;
  dialogView: FormView;
  onClose: () => void;
}

export interface IDialogState {

}

export class DialogState implements IDialogState {
}

export default class Dialog extends React.PureComponent<IDialogProps, IDialogState> {
  private LOG_SOURCE = "🔶 Dialog";

  public constructor(props: IDialogProps) {
    super(props);
    this.state = new DialogState();
  }

  public render(): React.ReactElement<IDialogProps> {
    try {
      const styleBlock = { "--lqdDialogHeight": `40vh`, "--lqdDialogWidth": `60vh` } as React.CSSProperties;
      return (
        <div className="tmp-hidden" data-component={this.LOG_SOURCE}>
          <dialog className={`hoo-mdldialog-outer is-sidebar-right ${(this.props.visability ? 'is-visible' : '')}`}>
            <div className="hoo-mdldialog" style={styleBlock}  >
              <div className="hoo-dlgheader">
                <div className="hoo-dlgheader-title">
                  <h2>{this.props.title}</h2>
                </div>
                <div className="hoo-dlgheader-closer"><HOOIcon
                  iconName="hoo-icon-close"
                  iconLabel='Close'
                  rootElementAttributes={{
                    onClick: () => this.props.onClose()
                  }}
                />
                </div>
              </div>
              <div className="hoo-dlgcontent">
                {this.props.children}
              </div>
            </div>
          </dialog>


        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }
  }
}