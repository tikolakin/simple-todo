import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreate() {
    this.state = new ReactiveDict();
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        if (!instance.state.get('hideCompleted')) {
            // If hide complated is checked - filter tasks
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }

        // Otherwise reutrn all of the tasks
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incomplatedCount() {
        return Tasks.find({ checked: { $ne: true}}).count();
    }
});

Template.body.events({
    'submit .new-task'() {
        // Prevent default browser to submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        // Clear form
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
    'change .toggle-checked input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});