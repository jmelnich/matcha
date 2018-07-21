import React, { Component } from 'react'
import ProfileHead from './ProfileHead'
import ProfileUserInfo from './ProfileUserInfo'
import ProfileUserPhotos from './ProfileUserPhotos'
import ProfileWritePost from './ProfileWritePost'

import {connect} from 'react-redux'
import {getUser} from '../../actions/userActions'
import PropTypes from 'prop-types'
import ProfileUserInterests from './ProfileUserInterests'
import ProfileFeedPosts from './ProfileFeedPosts'

class Profile extends Component {
  render() {
    return (
    <div>
      <ProfileHead />
      <div className="profile-main">
        <div className="container-flex">
          <div className="profile-main-info">
              <ProfileUserInfo/>
              <ProfileUserPhotos/>
              <ProfileUserInterests/>
              <div className="profile-main-info-list">
                  <h3>Friends</h3>
                  <ul>
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
              </div>

              <div className="profile-main-info-list">
                  <h3>Suggestions</h3>
                  <ul>
                      <li></li>
                  </ul>
              </div>
          </div>

          <div className="profile-main-feed">
              <ProfileWritePost/>
              <ProfileFeedPosts/>
          </div>
      </div>
    </div>
    </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: () => dispatch(getUser())
    }
};

Profile.propTypes = {
    getUser: PropTypes.func.isRequired
};

export default connect (null, mapDispatchToProps)(Profile);