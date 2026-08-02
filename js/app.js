/**
 * FixMyCampus - Campus Facility Defect & Maintenance Management System
 * Client Application Logic & Local State Engine
 */

(function () {
  'use strict';

  // Seed / Initial Mock Data
  const INITIAL_TICKETS = [
    {
      id: 'FMC-1001',
      title: "Severe Ceiling Water Leak near Restroom",
      building: "Main Library",
      location: "Floor 2, West Wing Hallway",
      category: "Plumbing",
      priority: "High",
      status: "In Progress",
      description: "Water dripping rapidly from ceiling tile near room 204. Bucket has been placed temporarily by janitorial staff, but ceiling drywall looks sagged.",
      image: "assets/images/water_leak.png",
      reporter: "Sarah Jenkins (Student ID: 88402)",
      anonymous: false,
      dateSubmitted: "2026-08-01 09:30 AM",
      technician: "Dave Miller (Senior Plumbing Specialist)",
      eta: "Today, 4:00 PM",
      timeline: [
        { time: "2026-08-01 09:30 AM", title: "Report Submitted", author: "Sarah Jenkins", text: "Defect logged via student portal." },
        { time: "2026-08-01 10:15 AM", title: "Status Changed: Under Review", author: "Dispatch Desk", text: "Ticket triaged and flagged high priority." },
        { time: "2026-08-01 11:00 AM", title: "Assigned to Dave Miller", author: "Facilities Admin", text: "Assigned plumbing team lead." },
        { time: "2026-08-01 01:45 PM", title: "Status Changed: In Progress", author: "Dave Miller", text: "On-site inspecting main valve leak in ceiling cavity above floor 2." }
      ],
      comments: [
        { author: "Dave Miller (Facilities)", time: "Yesterday, 2:15 PM", text: "Replacement valve sourced from central warehouse. Repair underway." }
      ]
    },
    {
      id: 'FMC-1002',
      title: "HVAC Unit Blowing Warm Air in Lecture Hall 204",
      building: "Science Complex",
      location: "Room 204 (Lecture Theatre A)",
      category: "HVAC",
      priority: "Medium",
      status: "Assigned",
      description: "Air conditioning in lecture hall is failing, room temperature reached 28°C during afternoon chemistry lecture.",
      image: "assets/images/broken_ac.png",
      reporter: "Prof. Alan Vance",
      anonymous: false,
      dateSubmitted: "2026-08-02 08:15 AM",
      technician: "Carlos Rodriguez (HVAC Tech)",
      eta: "Tomorrow, 10:00 AM",
      timeline: [
        { time: "2026-08-02 08:15 AM", title: "Report Submitted", author: "Prof. Alan Vance", text: "Defect logged." },
        { time: "2026-08-02 09:00 AM", title: "Assigned to Carlos Rodriguez", author: "Operations", text: "Scheduled for compressor diagnostics." }
      ],
      comments: []
    },
    {
      id: 'FMC-1003',
      title: "Elevator B Stalled & Call Button Unresponsive",
      building: "Engineering Hall",
      location: "Elevator Shaft B (Floor 3)",
      category: "Elevators",
      priority: "Urgent",
      status: "Under Review",
      description: "Elevator B doors malfunctioned on floor 3 and unit shut down into safety locking mode. Elevator currently out of service.",
      image: null,
      reporter: "Marcus Sterling",
      anonymous: false,
      dateSubmitted: "2026-08-02 11:20 AM",
      technician: "Unassigned",
      eta: "Pending Inspection",
      timeline: [
        { time: "2026-08-02 11:20 AM", title: "Report Submitted", author: "Marcus Sterling", text: "Urgent ticket created." }
      ],
      comments: [
        { author: "Campus Safety", time: "11:25 AM", text: "Confirmed no occupants trapped inside. Elevator shut down safely." }
      ]
    },
    {
      id: 'FMC-1004',
      title: "Wi-Fi Access Point Dropping Packets in Food Court",
      building: "Student Union",
      location: "Ground Floor Food Court Area",
      category: "IT / Wi-Fi",
      priority: "Low",
      status: "Submitted",
      description: "Campus-Guest and Campus-Secure Wi-Fi keeps disconnecting every 5 minutes in the seating area near Subway.",
      image: null,
      reporter: "Anonymous Student",
      anonymous: true,
      dateSubmitted: "2026-08-02 01:05 PM",
      technician: "Unassigned",
      eta: "To be determined",
      timeline: [
        { time: "2026-08-02 01:05 PM", title: "Report Submitted", author: "Anonymous Student", text: "Logged via web app." }
      ],
      comments: []
    },
    {
      id: 'FMC-1005',
      title: "Flickering LED Ceiling Light & Buzzing Noise",
      building: "Dormitory Block C",
      location: "Study Lounge (3rd Floor)",
      category: "Electrical",
      priority: "Low",
      status: "Resolved",
      description: "Overhead panel light flickering constantly causing eye strain during night study sessions.",
      image: null,
      reporter: "Alex Rivera",
      anonymous: false,
      dateSubmitted: "2026-07-31 06:40 PM",
      technician: "Dave Miller",
      eta: "Completed",
      timeline: [
        { time: "2026-07-31 06:40 PM", title: "Report Submitted", author: "Alex Rivera", text: "Report submitted." },
        { time: "2026-08-01 08:30 AM", title: "Assigned & In Progress", author: "Dave Miller", text: "Replaced ballast driver and LED strip." },
        { time: "2026-08-01 10:00 AM", title: "Status: Resolved", author: "Dave Miller", text: "Light fixture tested and verified functional." }
      ],
      comments: [
        { author: "Alex Rivera (Student)", time: "2026-08-01 10:30 AM", text: "Super fast response! Thank you!" }
      ],
      rating: 5
    },
    {
      id: 'FMC-1006',
      title: "Broken Security Lamp on Pathway to East Lot",
      building: "Sports Complex",
      location: "Outdoor Pathway North-East",
      category: "Safety / Security",
      priority: "High",
      status: "In Progress",
      description: "Pathway light post #14 cover shattered and bulb extinguished. Area is very dark at night.",
      image: null,
      reporter: "Campus Security Officer",
      anonymous: false,
      dateSubmitted: "2026-08-01 10:00 PM",
      technician: "Carlos Rodriguez",
      eta: "Today, 6:00 PM",
      timeline: [
        { time: "2026-08-01 10:00 PM", title: "Report Submitted", author: "Campus Security Officer", text: "Patrol log entry." },
        { time: "2026-08-02 08:00 AM", title: "Status: In Progress", author: "Carlos Rodriguez", text: "Ordering replacement vandal-proof glass cover." }
      ],
      comments: []
    }
  ];

  // State Store
  let tickets = [];
  let currentRole = 'reporter'; // 'reporter', 'admin', 'technician'
  let currentFilterStatus = 'all';
  let currentFilterBuilding = 'all';
  let currentFilterCategory = 'all';
  let searchQuery = '';
  let activeTicketId = null;

  // Initialize App
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    bindEvents();
    renderAll();
  });

  // State Persistence
  function loadState() {
    const saved = localStorage.getItem('fixmycampus_tickets');
    if (saved) {
      try {
        tickets = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved tickets", e);
        tickets = [...INITIAL_TICKETS];
      }
    } else {
      tickets = [...INITIAL_TICKETS];
      saveState();
    }
  }

  function saveState() {
    localStorage.setItem('fixmycampus_tickets', JSON.stringify(tickets));
  }

  // Event Listeners Registration
  function bindEvents() {
    // Role Switching Buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentRole = e.currentTarget.dataset.role;
        switchRoleView(currentRole);
      });
    });

    // Navigation Tabs
    document.querySelectorAll('[data-view-target]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = e.currentTarget.dataset.viewTarget;
        showView(targetView);
      });
    });

    // Filter Buttons / Controls
    document.querySelectorAll('#statusFilters .filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('#statusFilters .filter-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentFilterStatus = e.currentTarget.dataset.status;
        renderTicketGrid();
        renderAdminTable();
      });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderTicketGrid();
        renderAdminTable();
      });
    }

    const buildingFilter = document.getElementById('buildingFilterSelect');
    if (buildingFilter) {
      buildingFilter.addEventListener('change', (e) => {
        currentFilterBuilding = e.target.value;
        renderTicketGrid();
        renderAdminTable();
      });
    }

    const categoryFilter = document.getElementById('categoryFilterSelect');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        currentFilterCategory = e.target.value;
        renderTicketGrid();
        renderAdminTable();
      });
    }

    // New Report Form Submission
    const reportForm = document.getElementById('newReportForm');
    if (reportForm) {
      reportForm.addEventListener('submit', handleNewReportSubmit);
    }

    // File input preview
    const photoInput = document.getElementById('reportPhotoInput');
    if (photoInput) {
      photoInput.addEventListener('change', handlePhotoPreview);
    }

    // Quick Sample Image Clickers
    document.querySelectorAll('.preset-photo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const imgUrl = e.currentTarget.dataset.imgUrl;
        setFormImagePreview(imgUrl);
      });
    });

    // Comment Form Submission in Ticket Detail Modal
    const commentForm = document.getElementById('addCommentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', handleAddCommentSubmit);
    }

    // Modal Status Change Selector (Admin/Tech)
    const modalStatusSelect = document.getElementById('modalStatusSelect');
    if (modalStatusSelect) {
      modalStatusSelect.addEventListener('change', handleModalStatusChange);
    }

    // Modal Assign Tech Select
    const modalTechSelect = document.getElementById('modalTechSelect');
    if (modalTechSelect) {
      modalTechSelect.addEventListener('change', handleModalTechAssign);
    }

    // Reset Data Button
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm("Reset dataset back to default demo state?")) {
          tickets = [...INITIAL_TICKETS];
          saveState();
          renderAll();
          showToast("Demo state restored successfully!", "success");
        }
      });
    }
  }

  // Render Core UI Components
  function renderAll() {
    renderKPIs();
    renderTicketGrid();
    renderAdminTable();
    renderCampusMap();
    renderTechnicianBoard();
  }

  // Filter Pipeline Helper
  function getFilteredTickets() {
    return tickets.filter(t => {
      // Status match
      if (currentFilterStatus !== 'all' && t.status.toLowerCase().replace(/\s+/g, '-') !== currentFilterStatus) {
        if (currentFilterStatus === 'open' && (t.status === 'Resolved')) return false;
        if (currentFilterStatus !== 'open' && t.status.toLowerCase().replace(/\s+/g, '-') !== currentFilterStatus) return false;
      }
      // Building match
      if (currentFilterBuilding !== 'all' && t.building !== currentFilterBuilding) {
        return false;
      }
      // Category match
      if (currentFilterCategory !== 'all' && t.category !== currentFilterCategory) {
        return false;
      }
      // Search Query match
      if (searchQuery) {
        const text = `${t.id} ${t.title} ${t.building} ${t.location} ${t.category} ${t.description} ${t.reporter} ${t.technician}`.toLowerCase();
        if (!text.includes(searchQuery)) return false;
      }
      return true;
    });
  }

  // Render KPI Stat Cards
  function renderKPIs() {
    const total = tickets.length;
    const openCount = tickets.filter(t => t.status !== 'Resolved').length;
    const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
    const urgentCount = tickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

    document.getElementById('kpiTotal').textContent = total;
    document.getElementById('kpiOpen').textContent = openCount;
    document.getElementById('kpiInProgress').textContent = inProgressCount;
    document.getElementById('kpiUrgent').textContent = urgentCount;
    document.getElementById('kpiResolved').textContent = resolvedCount;
  }

  // Render Student / User Ticket Cards Grid
  function renderTicketGrid() {
    const container = document.getElementById('ticketGridContainer');
    if (!container) return;

    const list = getFilteredTickets();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="fmc-card p-5">
            <i class="bi bi-inbox text-muted display-4"></i>
            <h5 class="mt-3 font-weight-bold">No defect reports found</h5>
            <p class="text-muted">Try adjusting your filter criteria or search query.</p>
            <button class="btn btn-fmc-outline btn-sm mt-2" onclick="document.getElementById('searchInput').value=''; location.reload();">Clear Filters</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(ticket => `
      <div class="col-md-6 col-lg-4 mb-4 fade-in">
        <div class="fmc-card fmc-card-interactive h-100 d-flex flex-column" onclick="window.FixMyCampusApp.openTicketModal('${ticket.id}')">
          ${ticket.image ? `<img src="${ticket.image}" alt="${ticket.title}" class="card-img-top" style="height: 160px; object-fit: cover;">` : ''}
          <div class="p-3 d-flex flex-column flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge ${getStatusBadgeClass(ticket.status)}">${ticket.status}</span>
              <span class="text-muted small fw-semibold"><i class="bi bi-tag-fill me-1"></i>${ticket.id}</span>
            </div>
            
            <h6 class="fw-bold text-dark mb-1" style="font-size: 0.975rem;">${escapeHtml(ticket.title)}</h6>
            
            <p class="text-muted small mb-3 flex-grow-1 text-truncate-2" style="font-size: 0.85rem;">
              ${escapeHtml(ticket.description)}
            </p>

            <div class="pt-2 border-top mt-auto">
              <div class="d-flex align-items-center text-muted small mb-1">
                <i class="bi bi-geo-alt-fill text-primary me-2"></i>
                <span class="fw-medium text-dark">${escapeHtml(ticket.building)}</span>
                <span class="ms-1 text-muted">(${escapeHtml(ticket.location)})</span>
              </div>
              
              <div class="d-flex justify-content-between align-items-center mt-2 pt-1">
                <span class="small text-muted"><i class="bi bi-clock me-1"></i>${ticket.dateSubmitted.split(' ')[0]}</span>
                <span class="badge bg-light text-dark border">
                  <span class="priority-pill priority-${ticket.priority.toLowerCase()} me-1"></span>
                  ${ticket.priority} Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Admin Operations Master Table
  function renderAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;

    const list = getFilteredTickets();

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No matching defect tickets found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(t => `
      <tr>
        <td><strong class="text-primary">${t.id}</strong></td>
        <td>
          <div class="fw-semibold text-dark">${escapeHtml(t.title)}</div>
          <small class="text-muted"><i class="bi bi-person me-1"></i>${escapeHtml(t.reporter)}</small>
        </td>
        <td>
          <div><i class="bi bi-building me-1 text-secondary"></i>${escapeHtml(t.building)}</div>
          <small class="text-muted">${escapeHtml(t.location)}</small>
        </td>
        <td><span class="badge bg-light text-dark border">${t.category}</span></td>
        <td>
          <span class="badge ${getStatusBadgeClass(t.status)}">${t.status}</span>
        </td>
        <td>
          <span class="badge ${getPriorityBadgeClass(t.priority)}">${t.priority}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-fmc-outline" onclick="window.FixMyCampusApp.openTicketModal('${t.id}')">
            <i class="bi bi-sliders me-1"></i>Manage
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render Campus Map Grid
  function renderCampusMap() {
    const container = document.getElementById('campusMapContainer');
    if (!container) return;

    const buildings = [
      { name: "Main Library", icon: "bi-book-half", desc: "Central Study & Archives" },
      { name: "Science Complex", icon: "bi-magic", desc: "Labs & Lecture Halls 100-300" },
      { name: "Engineering Hall", icon: "bi-cpu-fill", desc: "Robotics & Heavy Labs" },
      { name: "Student Union", icon: "bi-cup-hot-fill", desc: "Food Court, Clubs & Lounge" },
      { name: "Dormitory Block C", icon: "bi-building-fill", desc: "Student Housing" },
      { name: "Sports Complex", icon: "bi-dribbble", desc: "Gym, Arena & Athletics" }
    ];

    container.innerHTML = buildings.map(b => {
      const activeTickets = tickets.filter(t => t.building === b.name && t.status !== 'Resolved');
      const urgentCount = activeTickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;
      
      let badgeClass = "bg-success text-white";
      if (activeTickets.length > 0) badgeClass = "bg-warning text-dark";
      if (urgentCount > 0) badgeClass = "bg-danger text-white";

      return `
        <div class="building-card fmc-card-interactive" onclick="window.FixMyCampusApp.filterByBuilding('${b.name}')">
          <div class="building-header">
            <div class="d-flex align-items-center gap-2">
              <div class="p-2 bg-light rounded text-primary fs-5"><i class="bi ${b.icon}"></i></div>
              <h6 class="building-title mb-0">${b.name}</h6>
            </div>
            <span class="defect-count-badge ${badgeClass}">${activeTickets.length} Active</span>
          </div>
          <p class="text-muted small mb-2">${b.desc}</p>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="small text-muted">Click to view tickets</span>
            <i class="bi bi-chevron-right text-primary"></i>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Technician Task Kanban Board
  function renderTechnicianBoard() {
    const container = document.getElementById('technicianBoardContainer');
    if (!container) return;

    const assigned = tickets.filter(t => t.status === 'Assigned' || t.status === 'In Progress');

    if (assigned.length === 0) {
      container.innerHTML = `<div class="col-12 text-center text-muted py-4">No active maintenance jobs assigned right now.</div>`;
      return;
    }

    container.innerHTML = assigned.map(t => `
      <div class="col-md-6 mb-3">
        <div class="fmc-card p-3 border-left-primary">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="badge ${getStatusBadgeClass(t.status)} mb-1">${t.status}</span>
              <h6 class="fw-bold text-dark mb-0">${escapeHtml(t.title)}</h6>
            </div>
            <span class="badge bg-light text-dark border">${t.id}</span>
          </div>
          
          <div class="small text-muted mb-2">
            <i class="bi bi-geo-alt text-primary me-1"></i>${escapeHtml(t.building)} - ${escapeHtml(t.location)}
          </div>
          <p class="small text-dark mb-3 bg-light p-2 rounded">${escapeHtml(t.description)}</p>

          <div class="d-flex justify-content-between align-items-center border-top pt-2">
            <span class="small text-muted"><i class="bi bi-person-badge me-1"></i>${escapeHtml(t.technician || 'Unassigned')}</span>
            <button class="btn btn-sm btn-fmc-primary" onclick="window.FixMyCampusApp.quickResolve('${t.id}')">
              <i class="bi bi-check-circle me-1"></i>Mark Resolved
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Handle New Ticket Submission
  function handleNewReportSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('reportTitle').value.trim();
    const category = document.getElementById('reportCategory').value;
    const building = document.getElementById('reportBuilding').value;
    const location = document.getElementById('reportLocation').value.trim();
    const priority = document.getElementById('reportPriority').value;
    const description = document.getElementById('reportDescription').value.trim();
    const reporter = document.getElementById('reportReporterName').value.trim() || 'Student / Campus Member';
    const anonymous = document.getElementById('reportAnonymousCheck').checked;
    const previewImg = document.getElementById('previewImgElement');
    const imageSrc = previewImg && previewImg.dataset.activeSrc ? previewImg.dataset.activeSrc : null;

    if (!title || !building || !description) {
      showToast("Please complete all required fields.", "danger");
      return;
    }

    const newTicketId = 'FMC-' + Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newTicket = {
      id: newTicketId,
      title: title,
      building: building,
      location: location || "General Area",
      category: category,
      priority: priority,
      status: "Submitted",
      description: description,
      image: imageSrc,
      reporter: anonymous ? "Anonymous Campus Member" : reporter,
      anonymous: anonymous,
      dateSubmitted: nowStr,
      technician: "Unassigned",
      eta: "Pending Triaging",
      timeline: [
        { time: nowStr, title: "Report Submitted", author: anonymous ? "Anonymous" : reporter, text: "Ticket submitted into FixMyCampus portal." }
      ],
      comments: []
    };

    tickets.unshift(newTicket);
    saveState();
    renderAll();

    // Close Modal if Bootstrap modal instance exists
    const modalEl = document.getElementById('newReportModal');
    if (modalEl) {
      const modalObj = bootstrap.Modal.getInstance(modalEl);
      if (modalObj) modalObj.hide();
    }

    // Reset Form
    e.target.reset();
    resetPhotoPreview();
    showToast(`Defect report ${newTicketId} logged successfully!`, "success");

    // Open ticket detail modal to show tracking pipeline
    openTicketModal(newTicketId);
  }

  // Handle Photo File Upload & Presets
  function handlePhotoPreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        setFormImagePreview(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function setFormImagePreview(srcUrl) {
    const container = document.getElementById('photoPreviewContainer');
    const img = document.getElementById('previewImgElement');
    if (container && img) {
      img.src = srcUrl;
      img.dataset.activeSrc = srcUrl;
      container.classList.remove('d-none');
    }
  }

  function resetPhotoPreview() {
    const container = document.getElementById('photoPreviewContainer');
    const img = document.getElementById('previewImgElement');
    if (container && img) {
      img.src = '';
      delete img.dataset.activeSrc;
      container.classList.add('d-none');
    }
  }

  // Open Ticket Detail & Progress Modal
  function openTicketModal(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    activeTicketId = ticketId;

    document.getElementById('modalTicketId').textContent = ticket.id;
    document.getElementById('modalTicketTitle').textContent = ticket.title;
    document.getElementById('modalTicketStatusBadge').innerHTML = `<span class="badge ${getStatusBadgeClass(ticket.status)}">${ticket.status}</span>`;
    document.getElementById('modalTicketBuilding').textContent = `${ticket.building} (${ticket.location})`;
    document.getElementById('modalTicketCategory').textContent = ticket.category;
    document.getElementById('modalTicketPriority').innerHTML = `<span class="badge ${getPriorityBadgeClass(ticket.priority)}">${ticket.priority}</span>`;
    document.getElementById('modalTicketReporter').textContent = ticket.reporter;
    document.getElementById('modalTicketDate').textContent = ticket.dateSubmitted;
    document.getElementById('modalTicketDescription').textContent = ticket.description;

    // Image preview in modal
    const imgContainer = document.getElementById('modalTicketImageContainer');
    if (ticket.image) {
      imgContainer.innerHTML = `<img src="${ticket.image}" class="img-fluid rounded border shadow-sm" style="max-height: 240px; object-fit: cover;">`;
      imgContainer.classList.remove('d-none');
    } else {
      imgContainer.classList.add('d-none');
      imgContainer.innerHTML = '';
    }

    // Controls setup
    const modalStatusSelect = document.getElementById('modalStatusSelect');
    if (modalStatusSelect) modalStatusSelect.value = ticket.status;

    const modalTechSelect = document.getElementById('modalTechSelect');
    if (modalTechSelect) modalTechSelect.value = ticket.technician.includes('Dave') ? 'Dave Miller' : (ticket.technician.includes('Carlos') ? 'Carlos Rodriguez' : 'Unassigned');

    // Render Timeline Stepper
    renderModalTimeline(ticket);

    // Render Comments Log
    renderModalComments(ticket);

    // Show modal using Bootstrap
    const modalEl = document.getElementById('ticketDetailModal');
    if (modalEl) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  }

  // Render Modal Timeline
  function renderModalTimeline(ticket) {
    const container = document.getElementById('modalTimelineStepper');
    if (!container) return;

    const steps = [
      { name: "Submitted", key: "Submitted" },
      { name: "Under Review", key: "Under Review" },
      { name: "Assigned", key: "Assigned" },
      { name: "In Progress", key: "In Progress" },
      { name: "Resolved", key: "Resolved" }
    ];

    const currentIdx = steps.findIndex(s => s.key === ticket.status);
    const effectiveIdx = currentIdx >= 0 ? currentIdx : 0;

    container.innerHTML = steps.map((s, index) => {
      let stateClass = "";
      if (index < effectiveIdx) stateClass = "step-completed";
      else if (index === effectiveIdx) stateClass = "step-active";

      return `
        <div class="timeline-step ${stateClass}">
          <div class="step-node">${index < effectiveIdx ? '<i class="bi bi-check-lg"></i>' : index + 1}</div>
          <div class="step-title">${s.name}</div>
        </div>
      `;
    }).join('');

    // Detailed Log list
    const logList = document.getElementById('modalTimelineLogList');
    if (logList) {
      logList.innerHTML = ticket.timeline.map(item => `
        <div class="d-flex gap-3 mb-3 border-bottom pb-2">
          <div class="text-primary fs-5"><i class="bi bi-clock-history"></i></div>
          <div>
            <div class="fw-bold text-dark small">${escapeHtml(item.title)}</div>
            <div class="text-muted small">${escapeHtml(item.text)}</div>
            <span class="text-muted extra-small" style="font-size: 0.75rem;">${item.time} • ${escapeHtml(item.author)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Comments Log
  function renderModalComments(ticket) {
    const container = document.getElementById('modalCommentsList');
    if (!container) return;

    if (!ticket.comments || ticket.comments.length === 0) {
      container.innerHTML = `<p class="text-muted small">No public comments or updates yet.</p>`;
      return;
    }

    container.innerHTML = ticket.comments.map(c => `
      <div class="comment-box">
        <div class="comment-meta">
          <span class="fw-semibold text-dark">${escapeHtml(c.author)}</span>
          <span>${c.time}</span>
        </div>
        <div class="text-dark small">${escapeHtml(c.text)}</div>
      </div>
    `).join('');
  }

  // Handle Comment Submission
  function handleAddCommentSubmit(e) {
    e.preventDefault();
    if (!activeTicketId) return;

    const input = document.getElementById('newCommentInput');
    const text = input.value.trim();
    if (!text) return;

    const ticket = tickets.find(t => t.id === activeTicketId);
    if (ticket) {
      const nowStr = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
      ticket.comments.push({
        author: currentRole === 'admin' ? 'Facilities Operations' : (currentRole === 'technician' ? 'Maintenance Tech' : 'Reporter'),
        time: nowStr,
        text: text
      });
      saveState();
      renderModalComments(ticket);
      input.value = '';
      showToast("Comment posted.", "info");
    }
  }

  // Handle Modal Status Change
  function handleModalStatusChange(e) {
    if (!activeTicketId) return;
    const newStatus = e.target.value;
    const ticket = tickets.find(t => t.id === activeTicketId);

    if (ticket && ticket.status !== newStatus) {
      ticket.status = newStatus;
      const nowStr = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
      ticket.timeline.push({
        time: nowStr,
        title: `Status Updated to ${newStatus}`,
        author: currentRole === 'admin' ? 'Facilities Admin' : 'Technician',
        text: `Ticket status set to ${newStatus}.`
      });

      saveState();
      renderAll();
      renderModalTimeline(ticket);
      document.getElementById('modalTicketStatusBadge').innerHTML = `<span class="badge ${getStatusBadgeClass(newStatus)}">${newStatus}</span>`;
      showToast(`Status updated to "${newStatus}"`, "success");
    }
  }

  // Handle Tech Assignment
  function handleModalTechAssign(e) {
    if (!activeTicketId) return;
    const techName = e.target.value;
    const ticket = tickets.find(t => t.id === activeTicketId);

    if (ticket) {
      ticket.technician = techName;
      if (ticket.status === 'Submitted' || ticket.status === 'Under Review') {
        ticket.status = 'Assigned';
      }
      saveState();
      renderAll();
      showToast(`Assigned to ${techName}`, "info");
    }
  }

  // Quick Resolve Helper for Tech Board
  function quickResolve(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'Resolved';
      const nowStr = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
      ticket.timeline.push({
        time: nowStr,
        title: "Status: Resolved",
        author: ticket.technician || "Maintenance Staff",
        text: "Issue inspected, repaired and verified on-site."
      });
      saveState();
      renderAll();
      showToast(`Ticket ${ticketId} marked as Resolved!`, "success");
    }
  }

  // Role Switching View Toggle
  function switchRoleView(role) {
    const adminTab = document.getElementById('navAdminTab');
    const techTab = document.getElementById('navTechTab');

    if (role === 'admin') {
      if (adminTab) adminTab.style.display = 'block';
      if (techTab) techTab.style.display = 'block';
      showView('adminView');
      showToast("Switched to Facilities Admin View", "info");
    } else if (role === 'technician') {
      if (adminTab) adminTab.style.display = 'block';
      if (techTab) techTab.style.display = 'block';
      showView('techView');
      showToast("Switched to Technician Field View", "info");
    } else {
      showView('studentView');
      showToast("Switched to Student & Staff Reporter View", "info");
    }
  }

  // View Navigation Helper
  function showView(viewId) {
    document.querySelectorAll('.app-view-section').forEach(sec => {
      sec.classList.add('d-none');
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove('d-none');
      target.classList.add('fade-in');
    }

    // Update active nav links
    document.querySelectorAll('[data-view-target]').forEach(link => {
      if (link.dataset.viewTarget === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function filterByBuilding(buildingName) {
    currentFilterBuilding = buildingName;
    const select = document.getElementById('buildingFilterSelect');
    if (select) select.value = buildingName;
    showView('studentView');
    renderTicketGrid();
    showToast(`Filtering tickets by building: ${buildingName}`, "info");
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container-fmc';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'danger' ? 'danger' : (type === 'success' ? 'success' : 'primary')} border-0 show fade-in`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : (type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill')} fs-5"></i>
          <div>${escapeHtml(message)}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  // Badge Helpers
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Submitted': return 'badge-submitted';
      case 'Under Review': return 'badge-review';
      case 'Assigned': return 'badge-assigned';
      case 'In Progress': return 'badge-in-progress';
      case 'Resolved': return 'badge-resolved';
      default: return 'badge-submitted';
    }
  }

  function getPriorityBadgeClass(priority) {
    switch (priority) {
      case 'Urgent': return 'badge-urgent';
      case 'High': return 'bg-danger text-white';
      case 'Medium': return 'bg-warning text-dark';
      case 'Low': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

  // Expose Global App API for inline onclick handlers
  window.FixMyCampusApp = {
    openTicketModal: openTicketModal,
    quickResolve: quickResolve,
    filterByBuilding: filterByBuilding,
    showToast: showToast
  };

})();
