import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Form, Field } from "react-final-form";
import styles from "./styles";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { FORM_ERROR } from "final-form";
import PropTypes from "prop-types";

import FullScreenLoader from "../../components/FullScreenLoader";
const AUTHENTICATE_USER = gql`
  mutation Authenticate($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      id
      token
    }
  }
`;

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "", loading: false };
  }
  static navigationOptions = {
    title: "Please sign in"
  };

  validate = values => {
    const errors = {};
    if (!values.email || values.email === "") {
      errors.email = "Email is required";
    } else if (/.*@.*\..*/.test(values.email) === false) {
      errors.email = "The email format is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? <FullScreenLoader /> : null}
        <View style={styles.backgroundTop}>
          <ImageBackground
            source={require("../../assets/images/background2-top.png")}
            style={styles.top}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image
                source={require("../../assets/images/back.png")}
                style={styles.back}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <Form
          onSubmit={async value => {
            try {
              this.setState({ loading: true });
              const result = await this.props.loginMutation({
                variables: { email: value.email, password: value.password }
              });

              const user = result.data.authenticateUser;

              await AsyncStorage.setItem("token", user.token);
              await AsyncStorage.setItem("id", user.id);

              console.log("In Login - Before navigate to Activities");
              this.setState({ loading: false });
              this.props.navigation.navigate("Activities");
            } catch (e) {
              this.setState({ loading: false });
              return {
                [FORM_ERROR]: "Incorrect email and/or password"
              };
            }
          }}
          validate={this.validate}
          render={({
            handleSubmit,
            pristine,
            invalid,
            hasSubmitErrors,
            submitError,
            form
          }) => (
            <View style={styles.flexContent}>
              <Text style={styles.text}>Log In</Text>
              <Field name="email">
                {({ input, meta }) => (
                  <View>
                    <TextInput
                      style={styles.form}
                      editable={true}
                      {...input}
                      placeholder="Email"
                      onChangeText={text => this.setState({ text })}
                    />
                    <Text style={styles.error}>
                      {meta.error && meta.touched && meta.error}
                    </Text>
                  </View>
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <View>
                    <TextInput
                      style={styles.form}
                      editable={true}
                      {...input}
                      placeholder="Password"
                      secureTextEntry={true}
                      onChangeText={text => this.setState({ text })}
                    />
                    <Text style={styles.error}>
                      {meta.error && meta.touched && meta.error}
                    </Text>
                  </View>
                )}
              </Field>
              {!pristine && !invalid ? (
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={pristine || invalid}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {}}
                  disabled={pristine || invalid}
                  style={styles.disabled}
                >
                  <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
              )}
              {hasSubmitErrors && (
                <Text style={styles.errorMessage}>{submitError}</Text>
              )}
            </View>
          )}
        />
        <View style={styles.backgroundBottom}>
          <Image
            source={require("../../assets/images/background2-bottom.png")}
            style={styles.bottom}
          />
        </View>
      </View>
    );
  }
}
LogIn.propTypes = {
  loginMutation: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

export default compose(graphql(AUTHENTICATE_USER, { name: "loginMutation" }))(
  LogIn
);
