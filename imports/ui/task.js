import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.events({
	'click .toggle-checked'() {
		// Set the property to opposite of current
		Tasks.update(this._id, {
			$set: { checked: !this.checked},
		});
	},
	'click .delete'() {
		Tasks.remove(this._id);
	}
});