// Network Defense Lessons 1-4 (120 questions)
// Malware Defense Lessons 1-4 (120 questions)

// Network Defense Lesson 1: OSI Model & Network Fundamentals (30 questions)
export const networkDefenseLesson1Questions = [
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does OSI stand for?',
    choices: [
      { text: 'Open Systems Interconnection', isCorrect: true },
      { text: 'Operating System Interface', isCorrect: false },
      { text: 'Optical Signal Integration', isCorrect: false },
      { text: 'Online Security Infrastructure', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'OSI (Open Systems Interconnection) is a conceptual model that standardizes network communication functions.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'How many layers does the OSI model have?',
    choices: [
      { text: '7 layers', isCorrect: true },
      { text: '5 layers', isCorrect: false },
      { text: '4 layers', isCorrect: false },
      { text: '9 layers', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is Layer 1 of the OSI model?',
    choices: [
      { text: 'Physical Layer - deals with cables, voltages, and bits', isCorrect: true },
      { text: 'Application Layer', isCorrect: false },
      { text: 'Network Layer', isCorrect: false },
      { text: 'Transport Layer', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The Physical Layer (Layer 1) handles the physical transmission of raw bits over network cables or wireless signals.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the primary function of Layer 2 (Data Link)?',
    choices: [
      { text: 'Frame creation, MAC addressing, and error detection', isCorrect: true },
      { text: 'IP addressing and routing', isCorrect: false },
      { text: 'User application interfaces', isCorrect: false },
      { text: 'Physical signal transmission', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Data Link Layer organizes bits into frames, uses MAC addresses, and provides error detection for local network transmission.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does MAC stand for in MAC address?',
    choices: [
      { text: 'Media Access Control', isCorrect: true },
      { text: 'Macintosh Computer', isCorrect: false },
      { text: 'Maximum Address Count', isCorrect: false },
      { text: 'Mandatory Access Code', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'MAC (Media Access Control) addresses are unique hardware identifiers assigned to network interface cards.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'Which layer handles IP addressing and routing?',
    choices: [
      { text: 'Network Layer (Layer 3)', isCorrect: true },
      { text: 'Transport Layer (Layer 4)', isCorrect: false },
      { text: 'Data Link Layer (Layer 2)', isCorrect: false },
      { text: 'Application Layer (Layer 7)', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Network Layer (Layer 3) handles logical addressing (IP), routing, and path determination across networks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What protocols operate at Layer 4 (Transport)?',
    choices: [
      { text: 'TCP and UDP', isCorrect: true },
      { text: 'IP and ICMP', isCorrect: false },
      { text: 'HTTP and FTP', isCorrect: false },
      { text: 'ARP and RARP', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'TCP and UDP are Layer 4 protocols responsible for end-to-end communication, port numbers, and data segmentation.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the difference between TCP and UDP?',
    choices: [
      { text: 'TCP is connection-oriented and reliable; UDP is connectionless and faster', isCorrect: true },
      { text: 'UDP is more secure than TCP', isCorrect: false },
      { text: 'TCP is faster than UDP', isCorrect: false },
      { text: 'They are the same protocol', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'TCP provides reliable, ordered delivery with error checking, while UDP offers faster, connectionless transmission without guarantees.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a port number used for?',
    choices: [
      { text: 'To identify specific applications or services on a device', isCorrect: true },
      { text: 'To identify physical network ports', isCorrect: false },
      { text: 'To encrypt network traffic', isCorrect: false },
      { text: 'To assign IP addresses', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Port numbers (0-65535) identify specific services, allowing multiple applications to use the network simultaneously.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'Which layer do HTTP, FTP, and SMTP operate on?',
    choices: [
      { text: 'Application Layer (Layer 7)', isCorrect: true },
      { text: 'Transport Layer (Layer 4)', isCorrect: false },
      { text: 'Network Layer (Layer 3)', isCorrect: false },
      { text: 'Session Layer (Layer 5)', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'HTTP, FTP, and SMTP are Application Layer protocols that provide services directly to users.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is an IP address?',
    choices: [
      { text: 'A logical address identifying a device on a network', isCorrect: true },
      { text: 'A physical hardware identifier', isCorrect: false },
      { text: 'An encryption key', isCorrect: false },
      { text: 'A port number', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'IP addresses are numerical labels that identify devices on IP networks, enabling routing and communication.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the difference between IPv4 and IPv6?',
    choices: [
      { text: 'IPv4 uses 32-bit addresses; IPv6 uses 128-bit addresses', isCorrect: true },
      { text: 'IPv6 is slower than IPv4', isCorrect: false },
      { text: 'IPv4 is more secure', isCorrect: false },
      { text: 'There is no difference', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IPv6 provides vastly more addresses (128-bit vs 32-bit), built-in security, and improved routing efficiency.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does DNS do?',
    choices: [
      { text: 'Translates domain names to IP addresses', isCorrect: true },
      { text: 'Encrypts network traffic', isCorrect: false },
      { text: 'Assigns IP addresses to devices', isCorrect: false },
      { text: 'Routes packets across networks', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'DNS (Domain Name System) converts human-readable domain names (like google.com) into IP addresses.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is DHCP used for?',
    choices: [
      { text: 'Automatically assigning IP addresses to devices', isCorrect: true },
      { text: 'Encrypting data', isCorrect: false },
      { text: 'Translating domain names', isCorrect: false },
      { text: 'Routing packets', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configurations to devices.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a subnet mask?',
    choices: [
      { text: 'Identifies which portion of an IP address is the network vs host', isCorrect: true },
      { text: 'A security encryption method', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'A network cable type', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Subnet masks divide IP addresses into network and host portions, enabling network segmentation.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a default gateway?',
    choices: [
      { text: 'The router that connects a local network to external networks', isCorrect: true },
      { text: 'The first device on a network', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'The DNS server address', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The default gateway is the router that forwards traffic from the local network to destinations outside it.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What protocol does ping use?',
    choices: [
      { text: 'ICMP (Internet Control Message Protocol)', isCorrect: true },
      { text: 'TCP', isCorrect: false },
      { text: 'UDP', isCorrect: false },
      { text: 'HTTP', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Ping uses ICMP Echo Request and Echo Reply messages to test network connectivity and measure latency.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is ARP used for?',
    choices: [
      { text: 'Resolving IP addresses to MAC addresses', isCorrect: true },
      { text: 'Routing packets between networks', isCorrect: false },
      { text: 'Encrypting communications', isCorrect: false },
      { text: 'Assigning IP addresses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'ARP (Address Resolution Protocol) maps IP addresses to physical MAC addresses on local networks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a switch in networking?',
    choices: [
      { text: 'A device that forwards frames based on MAC addresses within a LAN', isCorrect: true },
      { text: 'A device that routes packets between different networks', isCorrect: false },
      { text: 'A physical cable connector', isCorrect: false },
      { text: 'An encryption device', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Switches operate at Layer 2, learning MAC addresses and intelligently forwarding frames only to intended recipients.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a router?',
    choices: [
      { text: 'A device that forwards packets between different networks using IP addresses', isCorrect: true },
      { text: 'A device that connects devices within a single network', isCorrect: false },
      { text: 'A type of firewall only', isCorrect: false },
      { text: 'A wireless access point', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Routers operate at Layer 3, making forwarding decisions based on IP addresses to connect different networks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the Session Layer (Layer 5) responsible for?',
    choices: [
      { text: 'Establishing, maintaining, and terminating communication sessions', isCorrect: true },
      { text: 'Physical signal transmission', isCorrect: false },
      { text: 'Data encryption', isCorrect: false },
      { text: 'IP addressing', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Session Layer manages dialog control and synchronization between communicating applications.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does the Presentation Layer (Layer 6) handle?',
    choices: [
      { text: 'Data formatting, encryption, and compression', isCorrect: true },
      { text: 'Routing decisions', isCorrect: false },
      { text: 'Physical connections', isCorrect: false },
      { text: 'MAC addressing', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Presentation Layer translates data between application and network formats, handling encryption and compression.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a broadcast address used for?',
    choices: [
      { text: 'Sending data to all devices on a network segment', isCorrect: true },
      { text: 'Routing to the internet', isCorrect: false },
      { text: 'Encrypting communications', isCorrect: false },
      { text: 'DNS lookup', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Broadcast addresses allow sending packets to all hosts on a subnet simultaneously.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is NAT (Network Address Translation)?',
    choices: [
      { text: 'Translating private IP addresses to public ones for internet access', isCorrect: true },
      { text: 'Encrypting network traffic', isCorrect: false },
      { text: 'Resolving domain names', isCorrect: false },
      { text: 'Assigning MAC addresses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'NAT allows multiple devices with private IPs to share a single public IP for internet connectivity.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the loopback address in IPv4?',
    choices: [
      { text: '127.0.0.1', isCorrect: true },
      { text: '192.168.0.1', isCorrect: false },
      { text: '0.0.0.0', isCorrect: false },
      { text: '255.255.255.255', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The loopback address (127.0.0.1) refers to the local machine itself, used for testing network software.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What are private IP address ranges used for?',
    choices: [
      { text: 'Internal networks that don\'t directly connect to the internet', isCorrect: true },
      { text: 'Public internet servers only', isCorrect: false },
      { text: 'Encryption keys', isCorrect: false },
      { text: 'DNS servers', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Private IPs (10.x.x.x, 172.16-31.x.x, 192.168.x.x) are used internally and require NAT for internet access.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is encapsulation in networking?',
    choices: [
      { text: 'Wrapping data with protocol headers as it moves down the OSI layers', isCorrect: true },
      { text: 'Encrypting all network traffic', isCorrect: false },
      { text: 'Compressing data packets', isCorrect: false },
      { text: 'Physical cable shielding', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Encapsulation adds headers (and trailers) at each OSI layer, packaging data for transmission.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a VLAN?',
    choices: [
      { text: 'Virtual LAN that logically segments networks on the same physical infrastructure', isCorrect: true },
      { text: 'A type of VPN', isCorrect: false },
      { text: 'A wireless network', isCorrect: false },
      { text: 'A firewall rule', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'VLANs create logical network separations on switches, improving security and traffic management.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does TTL stand for in IP packets?',
    choices: [
      { text: 'Time To Live - prevents packets from circulating indefinitely', isCorrect: true },
      { text: 'Total Transmission Length', isCorrect: false },
      { text: 'Temporary Transport Layer', isCorrect: false },
      { text: 'Trusted Transfer Link', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'TTL is decremented at each router hop; when it reaches zero, the packet is discarded to prevent routing loops.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'Why is understanding the OSI model important for network security?',
    choices: [
      { text: 'It helps identify where attacks occur and where to apply defenses', isCorrect: true },
      { text: 'It encrypts all network traffic', isCorrect: false },
      { text: 'It prevents all cyberattacks', isCorrect: false },
      { text: 'It\'s not important for security', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Understanding each layer helps security professionals identify attack vectors and implement appropriate countermeasures.',
    points: 100
  }
];

// Due to length constraints, I'll continue in the next message with the remaining lessons
