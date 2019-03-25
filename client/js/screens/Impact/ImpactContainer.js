import React, { Component } from "react";
import { View, Text, AsyncStorage, ActivityIndicator } from "react-native";
import Impact from "./Impact";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const USER_INFO = gql`
  query USER($id: ID!) {
    allUsers(filter: { id: $id }) {
      id
      email
      point
      ghPoint
      createdAt
    }
  }
`;

export default class ImpactContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null
    };
  }
  componentDidMount = () => {
    AsyncStorage.getItem("id").then(value => {
      this.setState({ userID: value });
    });
  };
  render() {
    return (
      <Query query={USER_INFO} variables={{ id: this.state.userID }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <ActivityIndicator />;
          if (error) return <Text>error</Text>;
          console.log(data.allUsers[0]);
          if (data.allUsers) {
            return (
              <View>
                <Impact data={data.allUsers[0]} />
              </View>
            );
          }
          refetch();
          return <ActivityIndicator />;
        }}
      </Query>
    );
  }
}
