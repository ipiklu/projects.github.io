// --- Page Content Data ---
const pageContent = {
    'Overview': [
        { title: 'Primary Actions', desc: 'Main user interactions.', html: '<button class="btn btn-primary" onClick="window.open(\'https://google.com\', \'_blank\');">Submit</button>' },
        { title: 'Secondary Actions', desc: 'Less critical tasks.', html: '<button class="btn btn-outline">Cancel</button>' }
    ],
    'Provisioning': [
        { title: 'Documentation', desc: 'Local reference guide.', html: '<iframe src="topbarlinks/docs.html" width="100%" height="300px" style="border:1px solid #e2e8f0; border-radius:8px;"></iframe>' },
        { title: 'Data Exports', desc: 'Download your reports here.', html: '<button class="btn btn-outline">Download CSV</button>' }
    ],
    'IR': [
        { title: 'Management', desc: 'Danger zone actions.', html: '<button class="btn btn-danger">Delete Project</button>' }
    ],
    'Config': [
        { title: 'Account Settings', desc: 'Update your global profile.', html: '<button class="btn btn-primary">Save Settings</button>' }
    ],
    'SME': [
        { isHeader: true, html: '<span style="display:none">SME</span><iframe src="https://wikipedia.org" width="100%" height="840px"></iframe>' }
    ],
    'NCC': [
        { isHeader: true, html: '<span style="display:none">Wikipedia NCC</span><iframe src="http://161.118.185.109:8080" referrerpolicy="no-referrer" width="100%" height="840px"></iframe>' }
    ],
	'NSE': [
        { isHeader: true, html: '<span style="display:none">Wikipedia NCC</span><iframe src="http://161.118.185.109:7010" referrerpolicy="no-referrer" width="100%" height="840px"></iframe>' }
    ]
};