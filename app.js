const defaults = {
  startedAt: Date.now() - 6138000,
  members: [
    { id: 'rowan', name: 'Rowan', role: 'Blacksmith', level: 7, icon: '⚒', color: '#bc9960', actions: 24, success: 21, damage: 38, rolls: 47, failed: 6 },
    { id: 'lyra', name: 'Lyra', role: 'Scholar', level: 7, icon: '✦', color: '#829cab', actions: 28, success: 25, damage: 24, rolls: 53, failed: 5 },
    { id: 'kael', name: 'Kael', role: 'Hunter', level: 6, icon: '➶', color: '#718f6d', actions: 19, success: 15, damage: 31, rolls: 39, failed: 8 },
    { id: 'mira', name: 'Mira', role: 'Herbalist', level: 6, icon: '♧', color: '#947da1', actions: 22, success: 20, damage: 18, rolls: 44, failed: 4 }
  ],
  events: [
    { member: 'lyra', type: 'roll', outcome: 'success', detail: '5 / 5 slots', time: 'Just now' },
    { member: 'rowan', type: 'attack', outcome: 'success', detail: '38 damage', time: '1 min ago' },
    { member: 'kael', type: 'roll', outcome: 'failure', detail: '2 / 4 slots', time: '3 min ago' },
    { member: 'mira', type: 'action', outcome: 'success', detail: 'Party heal', time: '5 min ago' }
  ]
};

const clone = value => JSON.parse(JSON.stringify(value));
let data;
try { data = JSON.parse(localStorage.getItem('chronicle-session')) || clone(defaults); } catch { data = clone(defaults); }
const $ = selector => document.querySelector(selector);

function save() { localStorage.setItem('chronicle-session', JSON.stringify(data)); }
function memberFor(id) { return data.members.find(member => member.id === id); }
function rate(member) { return member.rolls ? Math.round(((member.rolls - member.failed) / member.rolls) * 100) : 0; }

function renderCards() {
  $('#party-grid').innerHTML = data.members.map(member => `
    <article class="member-card" style="--accent:${member.color}">
      <div class="member-head"><div class="avatar">${member.icon}</div><div><div class="member-name">${member.name}</div><div class="member-class">${member.role}</div></div><div class="level">LVL ${member.level}</div></div>
      <div class="success-rate"><strong>${rate(member)}%</strong><span>roll success</span></div>
      <div class="meter"><span style="width:${rate(member)}%"></span></div>
      <div class="stats"><div class="stat"><strong>${member.success}</strong><small>Actions</small></div><div class="stat"><strong>${member.damage}</strong><small>Avg dmg</small></div><div class="stat"><strong>${member.rolls}</strong><small>Dice rolled</small></div></div>
    </article>`).join('');
}

function renderChart() {
  const max = Math.max(...data.members.map(member => member.success + member.failed), 1);
  $('#chart').innerHTML = data.members.map(member => `
    <div class="chart-group"><div class="bars"><div class="bar success" style="height:${member.success / max * 100}%"><div class="bar-value">${member.success}</div></div><div class="bar failure" style="height:${member.failed / max * 100}%"><div class="bar-value">${member.failed}</div></div></div><div class="chart-name">${member.name}</div></div>`).join('');
}

const eventIcons = { roll: '◆', attack: '⚔', action: '✦' };
function renderEvents() {
  $('#event-list').innerHTML = data.events.slice(0, 4).map(event => {
    const member = memberFor(event.member);
    return `<li class="event-item"><span class="event-icon">${eventIcons[event.type]}</span><span class="event-main"><strong>${member?.name || 'Unknown'}</strong> · ${event.type}<small>${event.detail} · ${event.time}</small></span><span class="event-outcome ${event.outcome}">${event.outcome === 'success' ? '✓ Success' : '× Failed'}</span></li>`;
  }).join('') || '<li class="event-item"><span class="event-main">No events recorded yet.</span></li>';
}
function render() { renderCards(); renderChart(); renderEvents(); save(); }
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200); }

$('#member-input').innerHTML = data.members.map(member => `<option value="${member.id}">${member.name} · ${member.role}</option>`).join('');
$('#record-button').addEventListener('click', () => $('#event-dialog').showModal());
$('#type-input').addEventListener('change', event => $('#damage-label').hidden = event.target.value !== 'attack');
$('#type-input').dispatchEvent(new Event('change'));
$('#event-form').addEventListener('submit', event => {
  event.preventDefault();
  const member = memberFor($('#member-input').value);
  const type = $('#type-input').value;
  const outcome = $('#outcome-input').value;
  const damage = Math.max(0, Number($('#damage-input').value) || 0);
  if (type === 'roll') { member.rolls += 1; if (outcome === 'failure') member.failed += 1; }
  if (type === 'action') { member.actions += 1; if (outcome === 'success') member.success += 1; }
  if (type === 'attack') { member.actions += 1; if (outcome === 'success') { member.success += 1; member.damage = Math.round((member.damage + damage) / 2); } }
  data.events.unshift({ member: member.id, type, outcome, detail: type === 'attack' ? `${damage} damage` : type === 'roll' ? 'Manual dice result' : 'Manual action', time: 'Just now' });
  $('#event-dialog').close(); render(); toast('Event added to your chronicle');
});
$('#privacy-button').addEventListener('click', () => { document.body.classList.toggle('privacy'); toast(document.body.classList.contains('privacy') ? 'Names hidden' : 'Names visible'); });
$('#overlay-button').addEventListener('click', () => { document.body.classList.toggle('overlay'); $('#overlay-button').innerHTML = document.body.classList.contains('overlay') ? '<span>□</span> Dashboard' : '<span>▣</span> Overlay mode'; });
$('#clear-button').addEventListener('click', () => { if (confirm('Clear all manually recorded events and restore the sample session?')) { data = clone(defaults); render(); toast('Session reset'); } });
$('#safety-button').addEventListener('click', () => $('#safety-dialog').showModal());
$('#export-button').addEventListener('click', () => { const blob = new Blob([JSON.stringify({ schema: 1, exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'chronicle-session.json'; link.click(); URL.revokeObjectURL(link.href); toast('Session exported'); });
setInterval(() => { const total = Math.floor((Date.now() - data.startedAt) / 1000); const hours = String(Math.floor(total / 3600)).padStart(2, '0'); const mins = String(Math.floor(total % 3600 / 60)).padStart(2, '0'); const secs = String(total % 60).padStart(2, '0'); $('#session-time').textContent = `${hours}:${mins}:${secs}`; }, 1000);
render();
