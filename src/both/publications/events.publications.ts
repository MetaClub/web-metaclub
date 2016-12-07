/**
 * Created by Alexis on 2016-11-27.
 */

import {Meteor} from 'meteor/meteor';

import {Events} from '../collections/events.collection';

if (Meteor.isServer) {


    /**
     * Publish all the events
     * @returns {Object}    A cursor for all the events
     */
    Meteor.publish('events.all', () => {
        return Events.find({});
    });

    /**
     * Publish a specific event
     * @returns {Object}    A cursor for a specific event
     */
    Meteor.publish('events.byId', (eventId) => {
        //We validate our event id
        new SimpleSchema({
            eventId: {type: String, regEx: SimpleSchema.RegEx.Id}
        }).validate({eventId});

        return Events.find({_id: eventId});
    });

    /**
     * Publish the events for a specific user.
     * @returns {Object}    A cursor for the events associated to a user.
     */
    Meteor.publish('events.byUser', (userId) => {
        //We validate our event id
        new SimpleSchema({
            userId: {type: String, regEx: SimpleSchema.RegEx.Id}
        }).validate({userId});

        return Events.find({userId: userId});
    });

    /**
     * Publish all the events for a club
     * @returns {Object}    A cursor for all the events of a specific club.
     */
    Meteor.publish('events.byClub', (clubId) => {
        //We validate our event id
        new SimpleSchema({
            clubId: {type: String, regEx: SimpleSchema.RegEx.Id}
        }).validate({clubId});

        return Events.find({clubId: clubId});
    });

    /**
     * Let you get the events from a certain date range
     * @param {Date} [startDate=null]   The beginning of the date range.
     * @param {Date} [endDate=null] The ending of the date range.
     * @returns {Object}    A cursor for the events
     */
    Meteor.publish('events.byDateRange', (startDate: Date, endDate: Date) => {
        new SimpleSchema({
            startDate: {
                type: Date,
                optional: true
            },
            endDate: {
                type: Date,
                optional: true
            }
        }).validate({startDate: startDate, endDate: endDate});


        if (startDate != null && endDate != null) {
            if (startDate > endDate)
                throw new Meteor.Error('Invalid parameters values', 'The ending date must be higher that the starting date');

            return Events.find({
                startDatetime: {
                    '$gte': startDate
                },
                endDatetime: {
                    '$lte': endDate
                }
            });
        }
        else if (startDate != null) {
            return Events.find({
                startDatetime: {
                    '$gte': startDate
                }
            });
        } else if (endDate != null) {
            return Events.find({
                endDatetime: {
                    '$lte': endDate
                }
            });
        } else {
            return Events.find({});
        }
    });
}