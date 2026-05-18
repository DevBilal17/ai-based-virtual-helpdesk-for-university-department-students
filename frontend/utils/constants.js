// export const BASE_URL = "http://172.19.48.129:5000"

// export const BASE_URL_8000 = "http://172.19.48.129:8000"

export const BASE_URL = "http://192.168.1.39:5000";

export const BASE_URL_8000 = "http://192.168.1.39:8000";
// >>>>>>> 1a7f37397712dc4acb98b894a51a1e7f2e3ecc1d

export const COLORS = {
  primary: "#635BFF", // The vibrant purple from your "Add User" button
  background: "#0C1013", // Deep navy/black background
  surface: "#1C2D47", // Card/Input background
  accentBlue: "#3B82F6", // From the "Student" badge
  success: "#10B981", // From the "Active" status
  error: "#EF4444", // From the delete icon
  textMain: "#FFFFFF",
  textMuted: "#8E9AAF", // Secondary gray text
  glassBorder: "rgba(255, 255, 255, 0.1)",
};
export const DOOR_NODES = [
  // ================= FACULTY LEFT =================
  { id: "door_hod_office", x: 60, y: 955 },
  { id: "door_sir_tahir", x: 60, y: 918 },
  { id: "door_sir_shahbaz", x: 60, y: 884 },
  { id: "door_kitchen", x: 60, y: 850 },
  { id: "door_f_washroom", x: 60, y: 810 },

  // ================= FACULTY RIGHT =================
  { id: "door_faculty_room_2", x: 90, y: 955 },
  { id: "door_mam_rabia", x: 90, y: 918 },
  { id: "door_sir_afzaal", x: 90, y: 884 },
  { id: "door_sir_younas", x: 90, y: 850 },
  { id: "door_faculty_room_1", x: 90, y: 810 },

  // ================= IT AREA =================
  { id: "door_it01", x: 205, y: 825 },
  { id: "door_it02", x: 130, y: 733 },
  { id: "door_it03", x: 130, y: 514 },
  { id: "door_it04_05", x: 130, y: 460 },

  { id: "door_it06", x: 220, y: 435 },
  { id: "door_it07", x: 477, y: 435 },
  { id: "door_it08", x: 660, y: 435 },
  { id: "door_it09", x: 640, y: 490 },

  { id: "door_examination_center", x: 700, y: 435 },
  { id: "door_it_lab_1", x: 270, y: 490 },
  { id: "door_it_lab_2", x: 940, y: 435 },

  { id: "door_it_hall", x: 1020, y: 165 },

  { id: "door_meeting_room", x: 585, y: 490 },
  { id: "door_common_room", x: 205, y: 648 },
  { id: "door_girls_washroom", x: 120, y: 250 },
];
export const ROOMS = [
  { id: "entrance", name: "Entrance", x: 170, y: 978, doorNodeId: "entrance" }, // Entrance khud hi start node ban sakta hai

  // Faculty Left
  { id: "hod_office", name: "HOD Office", x: 23, y: 950, doorNodeId: "door_hod_office" },
  { id: "sir_tahir", name: "Sir Tahir", x: 26, y: 914, doorNodeId: "door_sir_tahir" },
  { id: "sir_shahbaz", name: "Sir Shahbaz", x: 25, y: 875, doorNodeId: "door_sir_shahbaz" },
  { id: "kitchen", name: "Kitchen", x: 27, y: 840, doorNodeId: "door_kitchen" },
  { id: "faculty_washroom", name: "F Washroom", x: 22, y: 805, doorNodeId: "door_f_washroom" },
  
  // Faculty Right
  { id: "faculty_room_2", name: "F Room 2", x: 94, y: 948, doorNodeId: "door_faculty_room_2" },
  { id: "mam_rabia", name: "Mam Rabia", x: 94, y: 915, doorNodeId: "door_mam_rabia" },
  { id: "sir_afzaal", name: "Sir Afzaal", x: 96, y: 877, doorNodeId: "door_sir_afzaal" },
  { id: "sir_younas", name: "Sir Younas", x: 96, y: 840, doorNodeId: "door_sir_younas" },
  { id: "faculty_room_1", name: "F Room 1", x: 96, y: 805, doorNodeId: "door_faculty_room_1" },

  // Students / IT Area
  { id: "it_01", name: "IT 01", x: 270, y: 760, doorNodeId: "door_it01" },
  { id: "it_02", name: "IT 02", x: 65, y: 675, doorNodeId: "door_it02" },
  { id: "it_03", name: "IT 03", x: 65, y: 545, doorNodeId: "door_it03" },
  { id: "it_04_5", name: "IT 04 & 05", x: 55, y: 360, doorNodeId: "door_it04_05" },
  { id: "it_06", name: "IT 06", x: 311, y: 280, doorNodeId: "door_it06" },
  { id: "it_07", name: "IT 07", x: 500, y: 280, doorNodeId: "door_it07" },
  { id: "it_08", name: "IT 08", x: 620, y: 280, doorNodeId: "door_it08" },
  { id: "it_09", name: "IT 09", x: 670, y: 560, doorNodeId: "door_it09" },
  
  { id: "it_lab_01", name: "IT Lab 1", x: 350, y: 560, doorNodeId: "door_it_lab_1" },
  { id: "it_lab_02", name: "IT Lab 2", x: 860, y: 280, doorNodeId: "door_it_lab_2" },
  { id: "it_hall", name: "IT Hall", x: 1080, y: 200, doorNodeId: "door_it_hall" },
  { id: "meeting_room", name: "Meeting Room", x: 520, y: 560, doorNodeId: "door_meeting_room" },
  { id: "examination_center", name: "Examination Center", x: 710, y: 280, doorNodeId: "door_examination_center" },

  { id: "girls_washroom", name: "Girls Washroom", x: 55, y: 170, doorNodeId: "door_girls_washroom" },
  { id: "common_room", name: "Common Room", x: 230, y: 650, doorNodeId: "door_common_room" },
];
// export const HALL_NODES = [
//   { id: "junction_a", x: 170, y: 900,type:"junction"},
//   { id: "hall_main_2", x: 200, y: 650 },
//   { id: "hall_main_3", x: 200, y: 450 },

//   { id: "junction_left", x: 100, y: 650 },
//   { id: "junction_right", x: 350, y: 650 },
// ];
export const JUNCTIONS = [
  {
    id: "j_entrance_split",
    x: 170,
    y: 985,
  },

  {
    id: "j_faculty_turn",
    x: 75,
    y: 985,
  },
  {
    id: "j_faculty_1_turn",
    x: 75,
    y: 955,
  },
  {
    id: "j_faculty_2_turn",
    x: 75,
    y: 918,
  },
  {
    id: "j_faculty_3_turn",
    x: 75,
    y: 884,
  },
  {
    id: "j_faculty_4_turn",
    x: 75,
    y: 850,
  },
    {
    id: "j_faculty_5_turn",
    x: 75,
    y: 810,
  },
  {
    id: "j_main_to_offices_corridor",
    x: 170,
    y: 785,
  },
  {
    id: "j_offices_to_main_corridor",
    x: 75,
    y: 785,
  },
  // {
  //   id: "j_main_mid",
  //   x: 170,
  //   y: 785,
  // },
  {
    id: "j_it_01_turn",
    x: 170,
    y: 825,
  },
  {
    id: "j_it_02_turn",
    x: 170,
    y: 733,
  },
  {
    id: "j_common_room_turn",
    x: 170,
    y: 648,
  },
  {
    id: "j_it_03_turn",
    x: 170,
    y: 514,
  },
  {
    id: "j_it_04_5_turn",
    x: 170,
    y: 460,
  },
  {
    id: "j_it_06_turn",
    x: 220,
    y: 460,
  },
  {
    id: "j_it_07_turn",
    x: 477,
    y: 460,
  },
  {
    id: "j_it_08_turn",
    x: 660,
    y: 460,
  },
  {
    id: "j_it_09_turn",
    x: 640,
    y: 460,
  },
  {
    id: "j_it_main",
    x: 170,
    y: 460,
  },
  {
    id: "j_it_lab_1_turn",
    x: 270,
    y: 460,
  },
  {
    id: "j_it_lab_2_turn",
    x: 940,
    y: 460,
  },
  {
    id: "j_examination_centre_turn",
    x: 700,
    y: 460,
  },
  {
    id: "j_meeting_room_turn",
    x: 585,
    y: 460,
  },

  {
    id: "j_it_hall_turn",
    x: 980,
    y: 165,
  },
  {
    id: "j_lab_turn",
    x: 980,
    y: 460,
  },
  {
    id: "j_girls_washroom_turn",
    x: 170,
    y: 250,
  },
  {
    id: "j_lab_02_to_it_hall",
    x: 980,
    y: 460,
  },
];
export const NODES = [...ROOMS, ...JUNCTIONS, ...DOOR_NODES];

export const RAW_CONNECTIONS = {
  entrance: ["j_entrance_split"],

  j_entrance_split: ["j_it_01_turn", "j_faculty_turn"],
  j_faculty_turn : ['j_faculty_1_turn'],
  j_faculty_1_turn:['j_faculty_2_turn','door_hod_office','door_faculty_room_2'],
  door_hod_office: ["hod_office"],
  door_faculty_room_2: ["faculty_room_2"],
  j_faculty_2_turn:['j_faculty_3_turn','door_sir_tahir','door_mam_rabia'],
  door_sir_tahir: ["sir_tahir"],
  door_mam_rabia: ["mam_rabia"],
  j_faculty_3_turn:['j_faculty_4_turn','door_sir_shahbaz','door_sir_afzaal'],
  door_sir_shahbaz: ["sir_shahbaz"],
  door_sir_afzaal: ["sir_afzaal"],
  j_faculty_4_turn:['j_faculty_5_turn','door_kitchen','door_sir_younas'],
  door_kitchen: ["kitchen"],
  door_sir_younas: ["sir_younas"],
  j_faculty_5_turn:['j_offices_to_main_corridor','door_f_washroom','door_faculty_room_1'],
  door_f_washroom: ["faculty_washroom"],
j_offices_to_main_corridor:["j_main_to_offices_corridor"],
  door_faculty_room_1: ["faculty_room_1"],
  // j_faculty_turn: [
  //   "door_hod_office",
  //   "door_sir_tahir",
  //   "door_sir_shahbaz",
  //   "door_kitchen",
  //   "door_f_washroom",
  //   "door_faculty_room_1",
  //   "door_faculty_room_2",
  //   "door_mam_rabia",
  //   "door_sir_afzaal",
  //   "door_sir_younas",
  // ],
  j_it_01_turn: ["door_it01", "j_main_to_offices_corridor"],

  door_it01: ["it_01"],
  j_main_to_offices_corridor: ["j_offices_to_main_corridor", "j_it_02_turn"],
  // Some more to add for faculty
  j_it_02_turn: ["door_it02", "j_common_room_turn"],

  door_it02: ["it_02"],

  j_common_room_turn: ["door_common_room", "j_it_03_turn"],
  door_common_room: ["common_room"],
  j_it_03_turn: ["door_it03", "j_it_04_5_turn", "j_it_main"],
  door_it03: ["it_03"],
  j_it_04_5_turn: ["door_it04_05", "j_girls_washroom_turn","j_it_main"],
  door_it04_05: ["it_04_5"],
  j_girls_washroom_turn: ["door_girls_washroom"],
  door_girls_washroom: ["girls_washroom"],
  j_it_main: ["j_it_06_turn", "j_girls_washroom_turn"],
  j_it_06_turn: ["door_it06", "j_it_lab_1_turn"],
  door_it06: ["it_06"],
  j_it_lab_1_turn: ["door_it_lab_1", "j_it_07_turn"],
  door_it_lab_1: ["it_lab_01"],
  j_it_07_turn: ["door_it07", "j_meeting_room_turn"],
  door_it07: ["it_07"],
  j_meeting_room_turn: ["j_it_09_turn", "door_meeting_room"],
  door_meeting_room: ["meeting_room"],
  j_it_09_turn: ["door_it09", "j_it_08_turn"],
  door_it09: ["it_09"],
  j_it_08_turn: ["door_it08", "j_examination_centre_turn"],
  door_it08: ["it_08"],
  j_examination_centre_turn: ["door_examination_center", "j_it_lab_2_turn"],
  door_examination_center: ["examination_center"],
  j_it_lab_2_turn: ["door_it_lab_2", "j_lab_02_to_it_hall"],
  door_it_lab_2: ["it_lab_02"],
  j_lab_02_to_it_hall: ["j_it_hall_turn"],
  j_it_hall_turn: ["door_it_hall"],
  door_it_hall: ["it_hall"],


};
export const CORRIDORS = [
  {
    id: "main_vertical",
    points: [
      { x: 170, y: 978 },
      { x: 170, y: 850 },
      { x: 170, y: 250 },
    ],
  },

  {
    id: "faculty_corridor",
    points: [
      { x: 170, y: 985 },
      { x: 90, y: 985 },
      { x: 75, y: 985 },
    ],
  },
  {
    id: "offices_corridor",
    points: [
      { x: 75, y: 985 },
      { x: 75, y: 885 },
      { x: 75, y: 785 },
    ],
  },
  {
    id: "offices_to_main_corridor",
    points: [
      { x: 75, y: 785 },
      { x: 110, y: 785 },
      { x: 170, y: 785 },
    ],
  },

  {
    id: "lab_corridor",
    points: [
      { x: 980, y: 460 },
      { x: 980, y: 260 },
      { x: 980, y: 160 },
    ],
  },
  {
    id: "it_corridor",
    points: [
      { x: 170, y: 460 },
      { x: 400, y: 460 },
      { x: 980, y: 460 },
    ],
  },

  {
    id: "it01_connector",
    points: [
      { x: 170, y: 825 }, // hallway
      { x: 200, y: 825 }, // door front
      { x: 210, y: 825 }, // room
    ],
  },
  {
    id: "it02_connector",
    points: [
      { x: 170, y: 733 }, // hallway
      { x: 150, y: 733 }, // door front
      { x: 130, y: 733 }, // room
    ],
  },

  {
    id: "it03_connector",
    points: [
      { x: 170, y: 514 }, // hallway
      { x: 150, y: 514 }, // door front
      { x: 130, y: 514 }, // room
    ],
  },

  {
    id: "it04_5_connector",
    points: [
      { x: 170, y: 460 }, // hallway
      { x: 150, y: 460 }, // door front
      { x: 130, y: 460 }, // room
    ],
  },

  {
    id: "it06_connector",
    points: [
      { x: 220, y: 460 }, // hallway
      { x: 220, y: 430 }, // door front
      { x: 220, y: 430 }, // room
    ],
  },

  {
    id: "it07_connector",
    points: [
      { x: 477, y: 460 }, // hallway
      { x: 477, y: 430 }, // door front
      { x: 477, y: 430 }, // room
    ],
  },

  {
    id: "it08_connector",
    points: [
      { x: 660, y: 460 }, // hallway
      { x: 660, y: 430 }, // door front
      { x: 660, y: 430 }, // room
    ],
  },

  {
    id: "it09_connector",
    points: [
      { x: 640, y: 460 }, // hallway
      { x: 640, y: 480 }, // door front
      { x: 640, y: 490 }, // room
    ],
  },
  {
    id: "examination_centre",
    points: [
      { x: 700, y: 460 }, // hallway
      { x: 700, y: 430 }, // door front
      { x: 700, y: 430 }, // room
    ],
  },
  {
    id: "it_lab_1_connector",
    points: [
      { x: 270, y: 460 }, // hallway
      { x: 270, y: 480 }, // door front
      { x: 270, y: 490 }, // room
    ],
  },
  {
    id: "it_lab_2_connector",
    points: [
      { x: 940, y: 460 }, // hallway
      { x: 940, y: 430 }, // door front
      { x: 940, y: 430 }, // room
    ],
  },

  {
    id: "it_hall_connector",
    points: [
      { x: 980, y: 165 }, // hallway
      { x: 1000, y: 165 }, // door front
      { x: 1020, y: 165 }, // room
    ],
  },
  {
    id: "meeting_room",
    points: [
      { x: 585, y: 460 }, // hallway
      { x: 585, y: 480 }, // door front
      { x: 585, y: 490 }, // room
    ],
  },
  {
    id: "common_room",
    points: [
      { x: 170, y: 648 }, // hallway
      { x: 200, y: 648 }, // door front
      { x: 210, y: 648 }, // room
    ],
  },
  {
    id: "girls_washroom",
    points: [
      { x: 170, y: 250 }, // hallway
      { x: 150, y: 250 }, // door front
      { x: 120, y: 250 }, // room
    ],
  },

  {
    id: "hod_connector",
    points: [
      { x: 75, y: 955 }, // hallway
      { x: 50, y: 955 }, // door
      { x: 23, y: 955 }, // room
    ],
  },

  {
    id: "sir_tahir_connector",
    points: [
      { x: 75, y: 918 },
      { x: 50, y: 918 },
      { x: 26, y: 918 },
    ],
  },

  {
    id: "sir_shahbaz_connector",
    points: [
      { x: 75, y: 884 },
      { x: 50, y: 884 },
      { x: 25, y: 884 },
    ],
  },

  {
    id: "kitchen_connector",
    points: [
      { x: 75, y: 850 },
      { x: 50, y: 850 },
      { x: 27, y: 850 },
    ],
  },
  {
    id: "f_washroom_connector",
    points: [
      { x: 75, y: 810 },
      { x: 50, y: 810 },
      { x: 27, y: 810 },
    ],
  },
  // RIGHT SIDE ROOMS
  {
    id: "faculty_room_2_connector",
    points: [
      { x: 75, y: 955 }, // hallway
      { x: 90, y: 955 }, // door
      { x: 100, y: 955 }, // room
    ],
  },

  {
    id: "mam_rabia_connector",
    points: [
      { x: 75, y: 918 },
      { x: 90, y: 918 },
      { x: 100, y: 918 },
    ],
  },

  {
    id: "sir_afzaal_connector",
    points: [
      { x: 75, y: 884 },
      { x: 90, y: 884 },
      { x: 100, y: 884 },
    ],
  },

  {
    id: "sir_younas_connector",
    points: [
      { x: 75, y: 850 },
      { x: 90, y: 850 },
      { x: 100, y: 850 },
    ],
  },

  {
    id: "faculty_room_1_connector",
    points: [
      { x: 75, y: 810 },
      { x: 90, y: 810 },
      { x: 100, y: 810 },
    ],
  },
  //
];

// export const CONNECTIONS = [
//   // entrance flow → hallway
//   ["entrance", "hall_main_1"],
//   ["hall_main_1", "hall_main_2"],
//   ["hall_main_2", "hall_main_3"],

//   // faculty branch (connect to hallway, NOT directly)
//   ["hall_main_2", "hod_office"],
//   ["hod_office", "sir_tahir"],
//   ["sir_tahir", "sir_shahbaz"],
//   ["sir_shahbaz", "kitchen"],
//   ["kitchen", "faculty_washroom"],

//   // student block branch
//   ["hall_main_2", "it_01"],
//   ["it_01", "it_02"],
//   ["it_02", "it_03"],
//   ["it_03", "it_04_5"],
//   ["it_04_5", "it_06"],
//   ["it_06", "it_07"],
//   ["it_07", "it_08"],
//   ["it_08", "it_09"],
// ];
