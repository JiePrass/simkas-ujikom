declare module "react-native-htmlview" {
    import { Component } from "react";
    import { StyleProp, ViewStyle } from "react-native";

    export interface HTMLViewProps {
        value: string;
        stylesheet?: any;
        style?: StyleProp<ViewStyle>;
    }

    export default class HTMLView extends Component<HTMLViewProps> {}
}
