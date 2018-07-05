import React, { Component } from 'react'
import ProfileHead from './ProfileHead'
import ProfileUserInfo from './ProfileUserInfo'
import ProfileUserPhotos from './ProfileUserPhotos'
import ProfileUserPost from './ProfileUserPost'
import {connect} from 'react-redux'
import {getUser} from '../actions/userActions'
import PropTypes from 'prop-types'

class Profile extends Component {
    componentDidMount() {
        this.props.getUser();
    }

  render() {
    let {user} = this.props;
    return (
    <div>
      <ProfileHead />
      <div className="profile-main">
        <div className="container-flex">
          <div className="profile-main-info">
              <ProfileUserInfo/>
              <ProfileUserPhotos/>


              <ul className="profile-main-info-list">
                  <h3>Personal Interests</h3>
                  <li>#gambling</li>
              </ul>

              <ul className="profile-main-info-list">
                  <h3>Friends</h3>
                  <li>
                      <p>friend</p>
                  </li>
                  <li>
                      <p>friend</p>
                  </li>
                  <li>
                      <p>friend</p>
                  </li>
                  <li>
                      <p>friend</p>
                  </li>
                  <li>
                      <p>friend</p>
                  </li>
              </ul>

              <ul className="profile-main-info-list">
                  <h3>Suggestions</h3>
                  <li></li>
              </ul>
          </div>

          <div className="profile-main-feed">
              <ProfileUserPost/>
              <div className="profile-feed-area">
                  <h3>Feed</h3>
                  No posts yet
              </div>
          </div>
      </div>
    </div>
    </div>
    )
  }
}

function mapStateToProps({user}) {
    return user;
};

function mapDispatchToProps(dispatch) {
    return {
        getUser: () => dispatch(getUser())
    }
};

Profile.propTypes = {
    user: PropTypes.object.isRequired
};

export default connect (mapStateToProps, mapDispatchToProps)(Profile);
