// ═══════════════════════════════════════════════════════════════
// COMSATS Library — Catalog Seed Script
//
// Seeds the database with realistic academic library data:
//   - 3 floors with shelves
//   - 12 categories
//   - 15 publishers
//   - 40 authors
//   - 60 books with 2-5 copies each (~180 copies)
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// ── Helper ──
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Data Definitions ──

const FLOORS = [
  { name: 'Ground Floor', floorNumber: 0, description: 'Circulation, reference collection, new arrivals, periodicals' },
  { name: 'First Floor', floorNumber: 1, description: 'General collection: Sciences, Engineering, Technology' },
  { name: 'Second Floor', floorNumber: 2, description: 'Humanities, Social Sciences, Islamic Studies, Theses' },
];

const SHELVES: Record<number, { code: string; section: string }[]> = {
  0: [
    { code: 'REF-A', section: 'Reference A-G' },
    { code: 'REF-H', section: 'Reference H-N' },
    { code: 'REF-O', section: 'Reference O-Z' },
    { code: 'PER-1', section: 'Current Periodicals' },
    { code: 'NEW-1', section: 'New Arrivals' },
  ],
  1: [
    { code: 'QA-1', section: 'Mathematics' },
    { code: 'QA-2', section: 'Computer Science' },
    { code: 'QB-1', section: 'Physics' },
    { code: 'QC-1', section: 'Chemistry' },
    { code: 'TA-1', section: 'Engineering General' },
    { code: 'TK-1', section: 'Electrical Engineering' },
    { code: 'TP-1', section: 'Chemical Engineering' },
  ],
  2: [
    { code: 'HA-1', section: 'Economics / Statistics' },
    { code: 'HF-1', section: 'Business / Management' },
    { code: 'HJ-1', section: 'Public Finance' },
    { code: 'BP-1', section: 'Islamic Studies' },
    { code: 'D-1', section: 'History' },
    { code: 'P-1', section: 'Languages / Literature' },
    { code: 'TH-1', section: 'Theses Collection' },
  ],
};

const CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Business & Management',
  'Economics',
  'Islamic Studies',
  'Environmental Science',
  'Biology',
  'Literature',
];

const PUBLISHERS = [
  'Pearson Education',
  'McGraw-Hill Education',
  'Oxford University Press',
  'Cambridge University Press',
  'Springer',
  'Wiley',
  'Prentice Hall',
  'Addison-Wesley',
  'McGraw-Hill',
  'MIT Press',
  'Elsevier',
  'Taylor & Francis',
  'Routledge',
  'Harvard University Press',
  'Cambridge University Press',
];

const AUTHORS = [
  // CS
  'Thomas H. Cormen', 'Andrew S. Tanenbaum', 'Abraham Silberschatz',
  'Randal E. Bryant', 'John L. Hennessy', 'Stuart Russell',
  'Michael T. Goodrich', 'Brian W. Kernighan', 'Donald E. Knuth',
  'Erich Gamma',
  // Math
  'James Stewart', 'Gilbert Strang', 'Kenneth H. Rosen',
  'Seymour Lipschutz', 'Howard Anton',
  // Physics
  'David Halliday', 'Raymond A. Serway', 'Hugh D. Young',
  // Engineering
  'William H. Hayt', 'John M. Howell', 'Merle C. Potter',
  'Frank M. White', 'Benjamin C. Kuo',
  // Business/Economics
  'Paul A. Samuelson', 'N. Gregory Mankiw', 'Philip Kotler',
  'Stephen P. Robbins', 'Oliver E. Williamson',
  // Islamic Studies
  'Seyyed Hossein Nasr', 'Ishtiaq Husain Qureshi', 'Abul A\'la Maududi',
  // Other
  'Rachel Carson', 'Edward O. Wilson', 'Jared Diamond',
];

// ── Books: 60 books with full metadata ──
const BOOKS = [
  // ── Computer Science (15) ──
  {
    title: 'Introduction to Algorithms',
    subtitle: 'Third Edition',
    description: 'This internationally acclaimed textbook provides a comprehensive introduction to the modern study of computer algorithms. It presents a broad perspective on algorithms with a strong emphasis on computational theory and mathematical rigor, covering sorting, graph algorithms, dynamic programming, and NP-completeness.',
    isbn: '978-0-262-03384-8',
    publicationYear: 2009, edition: '3rd', subject: 'Algorithms & Data Structures', language: 'English', pages: 1312, callNumber: 'QA76.9.A43 C66 2009', publisherName: 'MIT Press', authorNames: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Computer Networks',
    subtitle: 'Fifth Edition',
    description: 'A comprehensive guide to computer networking that covers everything from physical layer to application layer protocols. The book uses a layered approach to explain network architecture, including detailed coverage of TCP/IP, Ethernet, WiFi, and network security fundamentals.',
    isbn: '978-0-13-212695-3',
    publicationYear: 2010, edition: '5th', subject: 'Computer Networks', language: 'English', pages: 960, callNumber: 'TK5105.5.T38 2010', publisherName: 'Pearson Education', authorNames: ['Andrew S. Tanenbaum', 'David J. Wetherall'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Operating System Concepts',
    subtitle: 'Ninth Edition',
    description: 'The "Dinosaur Book" remains the definitive reference for operating system principles. It covers process management, memory management, file systems, I/O systems, and distributed systems with practical examples from Windows, Linux, and Android.',
    isbn: '978-1-118-06333-0',
    publicationYear: 2012, edition: '9th', subject: 'Operating Systems', language: 'English', pages: 976, callNumber: 'QA76.76.O63 S55 2012', publisherName: 'Wiley', authorNames: ['Abraham Silberschatz', 'Peter Baer Galvin', 'Greg Gagne'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Computer Systems: A Programmer\'s Perspective',
    subtitle: 'Third Edition',
    description: 'This book provides a programmer\'s perspective on computer systems, covering topics from bit-level data representation to machine-level optimization. It bridges the gap between software and hardware, teaching students how to write more efficient programs by understanding the underlying system.',
    isbn: '978-0-13-409266-9',
    publicationYear: 2015, edition: '3rd', subject: 'Computer Architecture', language: 'English', pages: 1120, callNumber: 'QA76.9.C643 B79 2015', publisherName: 'Pearson Education', authorNames: ['Randal E. Bryant', 'David R. O\'Hallaron'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    subtitle: 'Fourth Edition',
    description: 'The most comprehensive AI textbook available, covering search, knowledge representation, machine learning, natural language processing, computer vision, and robotics. It emphasizes both theoretical foundations and practical applications of AI techniques.',
    isbn: '978-0-13-461099-3',
    publicationYear: 2020, edition: '4th', subject: 'Artificial Intelligence', language: 'English', pages: 1136, callNumber: 'QA335.R86 2020', publisherName: 'Pearson Education', authorNames: ['Stuart Russell', 'Peter Norvig'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Data Structures and Algorithms in Java',
    subtitle: 'Sixth Edition',
    description: 'A clear and comprehensive introduction to data structures and algorithms using Java. Covers arrays, linked lists, stacks, queues, trees, heaps, hash tables, and graph algorithms with detailed implementations and complexity analysis.',
    isbn: '978-1-119-52759-6',
    publicationYear: 2014, edition: '6th', subject: 'Algorithms & Data Structures', language: 'English', pages: 736, callNumber: 'QA76.73.J38 G66 2014', publisherName: 'Wiley', authorNames: ['Michael T. Goodrich', 'Roberto Tamassia'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'The C Programming Language',
    subtitle: 'Second Edition',
    description: 'The definitive reference for C programming, written by the language\'s creators. This concise book covers all features of C from basic types and control flow to advanced topics like pointers, structures, and low-level memory management.',
    isbn: '978-0-13-110362-7',
    publicationYear: 1988, edition: '2nd', subject: 'Programming Languages', language: 'English', pages: 288, callNumber: 'QA76.73.C15 K47 1988', publisherName: 'Prentice Hall', authorNames: ['Brian W. Kernighan', 'Dennis M. Ritchie'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'The Art of Computer Programming',
    subtitle: 'Volume 1: Fundamental Algorithms',
    description: 'Knuth\'s masterwork on the analysis of algorithms. This first volume covers basic data structures and information structures with mathematical rigor. It includes the famous MIX assembly language and detailed mathematical derivations of algorithm complexity.',
    isbn: '978-0-201-89683-1',
    publicationYear: 1997, edition: '3rd', subject: 'Algorithms & Data Structures', language: 'English', pages: 672, callNumber: 'QA76.6.K64 1997', publisherName: 'Addison-Wesley', authorNames: ['Donald E. Knuth'], categoryNames: ['Computer Science', 'Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    subtitle: null,
    description: 'The foundational Gang of Four book that cataloged 23 classic design patterns for object-oriented software. Each pattern is described with its intent, motivation, applicability, structure, participants, and consequences with examples in C++ and Smalltalk.',
    isbn: '978-0-201-63361-0',
    publicationYear: 1994, edition: '1st', subject: 'Software Engineering', language: 'English', pages: 416, callNumber: 'QA76.64.D47 1994', publisherName: 'Addison-Wesley', authorNames: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Database System Concepts',
    subtitle: 'Seventh Edition',
    description: 'A comprehensive textbook on database management systems covering relational model, SQL, ER diagrams, normalization, indexing, transaction management, concurrency control, and advanced topics like distributed databases and data warehousing.',
    isbn: '978-0-07-802215-9',
    publicationYear: 2019, edition: '7th', subject: 'Database Systems', language: 'English', pages: 1376, callNumber: 'QA76.9.D3 S564 2019', publisherName: 'McGraw-Hill Education', authorNames: ['Abraham Silberschatz', 'Henry F. Korth', 'S. Sudarshan'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Compilers: Principles, Techniques, and Tools',
    subtitle: 'Second Edition',
    description: 'The classic "Dragon Book" on compiler design covers lexical analysis, parsing, syntax-directed translation, type checking, run-time environments, code generation, and code optimization. Essential reading for understanding how programming languages are implemented.',
    isbn: '978-0-321-48681-3',
    publicationYear: 2006, edition: '2nd', subject: 'Compilers', language: 'English', pages: 1008, callNumber: 'QA76.7.A85 2006', publisherName: 'Pearson Education', authorNames: ['Alfred V. Aho', 'Monica S. Lam', 'Ravi Sethi', 'Jeffrey D. Ullman'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Deep Learning',
    subtitle: null,
    description: 'Written by three pioneers in the field, this textbook covers the mathematical foundations of deep learning, from linear algebra and probability theory to modern architectures including convolutional networks, recurrent networks, generative models, and reinforcement learning.',
    isbn: '978-0-262-03561-3',
    publicationYear: 2016, edition: '1st', subject: 'Machine Learning', language: 'English', pages: 800, callNumber: 'QA76.9.D34 G66 2016', publisherName: 'MIT Press', authorNames: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Computer Organization and Design',
    subtitle: 'The Hardware/Software Interface',
    description: 'This textbook introduces computer organization with a focus on the hardware/software interface. Using the RISC-V instruction set architecture, it covers datapath design, pipelining, memory hierarchy, I/O, and parallel processing.',
    isbn: '978-0-12-820109-1',
    publicationYear: 2021, edition: '6th', subject: 'Computer Architecture', language: 'English', pages: 832, callNumber: 'QA76.9.C643 H47 2021', publisherName: 'Morgan Kaufmann', authorNames: ['John L. Hennessy', 'David A. Patterson'], categoryNames: ['Computer Science', 'Electrical Engineering'], floorNumber: 1, shelfCode: 'TK-1',
  },
  {
    title: 'Structured Computer Organization',
    subtitle: 'Sixth Edition',
    description: 'Tanenbaum\'s clear introduction to computer architecture uses a layered approach: digital logic layer, microarchitecture layer, instruction set architecture layer, operating system layer, and assembly language layer.',
    isbn: '978-0-13-291652-3',
    publicationYear: 2013, edition: '6th', subject: 'Computer Architecture', language: 'English', pages: 800, callNumber: 'QA76.9.C643 T38 2013', publisherName: 'Pearson Education', authorNames: ['Andrew S. Tanenbaum'], categoryNames: ['Computer Science'], floorNumber: 1, shelfCode: 'QA-2',
  },
  {
    title: 'Discrete Mathematics and Its Applications',
    subtitle: 'Eighth Edition',
    description: 'A comprehensive introduction to discrete mathematics covering logic, sets, functions, sequences, relations, graph theory, trees, number theory, combinatorics, Boolean algebra, and computation models with applications to computer science.',
    isbn: '978-1-259-67651-2',
    publicationYear: 2018, edition: '8th', subject: 'Discrete Mathematics', language: 'English', pages: 1120, callNumber: 'QA39.3.R67 2018', publisherName: 'McGraw-Hill Education', authorNames: ['Kenneth H. Rosen'], categoryNames: ['Computer Science', 'Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },

  // ── Mathematics (8) ──
  {
    title: 'Calculus: Early Transcendentals',
    subtitle: 'Eighth Edition',
    description: 'One of the most widely used calculus textbooks worldwide. Stewart\'s clear exposition covers limits, derivatives, integrals, infinite series, parametric equations, polar coordinates, and multivariable calculus with numerous examples and exercises.',
    isbn: '978-1-285-74155-0',
    publicationYear: 2015, edition: '8th', subject: 'Calculus', language: 'English', pages: 1368, callNumber: 'QA303.2.S74 2015', publisherName: 'Cengage Learning', authorNames: ['James Stewart'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Introduction to Linear Algebra',
    subtitle: 'Fifth Edition',
    description: 'Gilbert Strang\'s acclaimed textbook provides an intuitive yet rigorous introduction to linear algebra. It covers vectors, matrices, solving linear equations, orthogonality, determinants, eigenvalues, singular value decomposition, and applications in data science.',
    isbn: '978-0-9802327-7-6',
    publicationYear: 2016, edition: '5th', subject: 'Linear Algebra', language: 'English', pages: 584, callNumber: 'QA184.S73 2016', publisherName: 'Wellesley-Cambridge Press', authorNames: ['Gilbert Strang'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Linear Algebra and Its Applications',
    subtitle: 'Fifth Edition',
    description: 'A thorough treatment of linear algebra emphasizing conceptual understanding and real-world applications. Covers linear equations, matrix algebra, determinants, vector spaces, eigenvalues, orthogonality, and the singular value decomposition.',
    isbn: '978-0-321-98238-4',
    publicationYear: 2015, edition: '5th', subject: 'Linear Algebra', language: 'English', pages: 576, callNumber: 'QA184.2.L39 2015', publisherName: 'Pearson Education', authorNames: ['David C. Lay', 'Steven R. Lay', 'Judi J. McDonald'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Schaum\'s Outline of Linear Algebra',
    subtitle: 'Sixth Edition',
    description: 'A comprehensive review of linear algebra with 612 fully solved problems. Covers vector spaces, linear transformations, eigenvalues, inner product spaces, and canonical forms. Ideal for self-study and exam preparation.',
    isbn: '978-1-260-01147-2',
    publicationYear: 2017, edition: '6th', subject: 'Linear Algebra', language: 'English', pages: 432, callNumber: 'QA184.2.L56 2017', publisherName: 'McGraw-Hill', authorNames: ['Seymour Lipschutz', 'Marc Lipson'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Calculus',
    subtitle: 'Tenth Edition',
    description: 'Anton\'s comprehensive calculus textbook provides thorough coverage of single-variable and multivariable calculus with a strong emphasis on conceptual understanding and problem-solving skills.',
    isbn: '978-0-470-64772-1',
    publicationYear: 2012, edition: '10th', subject: 'Calculus', language: 'English', pages: 1168, callNumber: 'QA300.A66 2012', publisherName: 'Wiley', authorNames: ['Howard Anton', 'Irl C. Bivens', 'Stephen Davis'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Mathematical Statistics and Data Analysis',
    subtitle: 'Third Edition',
    description: 'This textbook provides a balanced treatment of mathematical statistics and data analysis methods. It covers probability distributions, estimation, hypothesis testing, regression analysis, and nonparametric methods with real data examples.',
    isbn: '978-0-534-20343-1',
    publicationYear: 2001, edition: '3rd', subject: 'Statistics', language: 'English', pages: 688, callNumber: 'QA276.R79 2001', publisherName: 'Cengage Learning', authorNames: ['John A. Rice'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Numerical Analysis',
    subtitle: 'Ninth Edition',
    description: 'A thorough introduction to numerical methods covering error analysis, solutions of equations in one variable, interpolation, numerical integration, differential equations, approximation theory, and eigenvalue computation.',
    isbn: '978-0-321-98369-5',
    publicationYear: 2010, edition: '9th', subject: 'Numerical Methods', language: 'English', pages: 912, callNumber: 'QA297.B79 2010', publisherName: 'Pearson Education', authorNames: ['Richard L. Burden', 'J. Douglas Faires'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },
  {
    title: 'Real Analysis',
    subtitle: 'Fourth Edition',
    description: 'A rigorous treatment of real analysis covering the real number system, sequences and series, continuity, differentiation, Riemann-Stieltjes integration, sequences and series of functions, and Lebesgue integration.',
    isbn: '978-0-13-468704-5',
    publicationYear: 2019, edition: '4th', subject: 'Real Analysis', language: 'English', pages: 560, callNumber: 'QA300.R825 2019', publisherName: 'Pearson Education', authorNames: ['Halsey L. Royden', 'Patrick M. Fitzpatrick'], categoryNames: ['Mathematics'], floorNumber: 1, shelfCode: 'QA-1',
  },

  // ── Physics (5) ──
  {
    title: 'Fundamentals of Physics',
    subtitle: 'Eleventh Edition',
    description: 'The standard introductory physics textbook used worldwide. Halliday, Resnick, and Walker provide clear explanations of mechanics, thermodynamics, electromagnetism, optics, and modern physics with thousands of worked examples and problems.',
    isbn: '978-1-119-45950-0',
    publicationYear: 2018, edition: '11th', subject: 'General Physics', language: 'English', pages: 1232, callNumber: 'QC21.3.H35 2018', publisherName: 'Wiley', authorNames: ['David Halliday', 'Robert Resnick', 'Jearl Walker'], categoryNames: ['Physics'], floorNumber: 1, shelfCode: 'QB-1',
  },
  {
    title: 'Physics for Scientists and Engineers',
    subtitle: 'Tenth Edition',
    description: 'A calculus-based physics textbook that provides thorough coverage of mechanics, oscillations, thermodynamics, electromagnetism, optics, and quantum mechanics with strong emphasis on problem-solving strategies and real-world applications.',
    isbn: '978-1-337-55327-5',
    publicationYear: 2018, edition: '10th', subject: 'General Physics', language: 'English', pages: 1328, callNumber: 'QC21.3.S43 2018', publisherName: 'Cengage Learning', authorNames: ['Raymond A. Serway', 'John W. Jewett'], categoryNames: ['Physics'], floorNumber: 1, shelfCode: 'QB-1',
  },
  {
    title: 'University Physics with Modern Physics',
    subtitle: 'Fifteenth Edition',
    description: 'Young and Freedman\'s comprehensive physics textbook covers mechanics, waves, thermodynamics, electromagnetism, optics, and modern physics with a focus on conceptual understanding and real-world applications in science and engineering.',
    isbn: '978-0-13-515620-0',
    publicationYear: 2019, edition: '15th', subject: 'General Physics', language: 'English', pages: 1600, callNumber: 'QC21.3.Y68 2019', publisherName: 'Pearson Education', authorNames: ['Hugh D. Young', 'Roger A. Freedman'], categoryNames: ['Physics'], floorNumber: 1, shelfCode: 'QB-1',
  },
  {
    title: 'Classical Mechanics',
    subtitle: 'Third Edition',
    description: 'Goldstein\'s classical text provides a sophisticated treatment of Newtonian, Lagrangian, and Hamiltonian mechanics. It covers central force motion, rigid body dynamics, oscillations, canonical transformations, and the Hamilton-Jacobi theory.',
    isbn: '978-0-201-65702-9',
    publicationYear: 2001, edition: '3rd', subject: 'Classical Mechanics', language: 'English', pages: 680, callNumber: 'QC125.2.G65 2001', publisherName: 'Addison-Wesley', authorNames: ['Herbert Goldstein', 'Charles P. Poole', 'John L. Safko'], categoryNames: ['Physics'], floorNumber: 1, shelfCode: 'QB-1',
  },
  {
    title: 'Introduction to Quantum Mechanics',
    subtitle: 'Third Edition',
    description: 'Griffiths\' clear and engaging introduction to quantum mechanics covers the Schrodinger equation, formalism, angular momentum, identical particles, perturbation theory, scattering, and the EPR paradox with a conversational yet precise writing style.',
    isbn: '978-1-107-17986-8',
    publicationYear: 2018, edition: '3rd', subject: 'Quantum Mechanics', language: 'English', pages: 504, callNumber: 'QC174.12.G75 2018', publisherName: 'Cambridge University Press', authorNames: ['David J. Griffiths', 'Darrell F. Schroeter'], categoryNames: ['Physics'], floorNumber: 1, shelfCode: 'QB-1',
  },

  // ── Electrical Engineering (5) ──
  {
    title: 'Engineering Electromagnetics',
    subtitle: 'Eighth Edition',
    description: 'Hayt\'s classic textbook provides a thorough treatment of electromagnetic theory covering vector analysis, Coulomb\'s law, Gauss\'s law, Poisson\'s equation, Biot-Savart law, Faraday\'s law, Maxwell\'s equations, and transmission lines.',
    isbn: '978-0-07-338066-7',
    publicationYear: 2011, edition: '8th', subject: 'Electromagnetics', language: 'English', pages: 608, callNumber: 'QC670.H39 2011', publisherName: 'McGraw-Hill Education', authorNames: ['William H. Hayt', 'John A. Buck'], categoryNames: ['Electrical Engineering', 'Physics'], floorNumber: 1, shelfCode: 'TK-1',
  },
  {
    title: 'Digital Signal Processing',
    subtitle: 'Fourth Edition',
    description: 'Proakis and Manolakis provide comprehensive coverage of discrete-time signals and systems, the discrete Fourier transform, digital filter design, and multirate signal processing with extensive MATLAB examples and exercises.',
    isbn: '978-0-13-198642-1',
    publicationYear: 2006, edition: '4th', subject: 'Signal Processing', language: 'English', pages: 1008, callNumber: 'TK5102.9.P76 2006', publisherName: 'Pearson Education', authorNames: ['John G. Proakis', 'Dimitris G. Manolakis'], categoryNames: ['Electrical Engineering'], floorNumber: 1, shelfCode: 'TK-1',
  },
  {
    title: 'Automatic Control Systems',
    subtitle: 'Tenth Edition',
    description: 'A comprehensive treatment of control systems theory covering mathematical modeling, transfer functions, block diagrams, signal flow graphs, time-domain analysis, root locus, frequency response, state-space methods, and digital control.',
    isbn: '978-1-259-64361-3',
    publicationYear: 2017, edition: '10th', subject: 'Control Systems', language: 'English', pages: 832, callNumber: 'TJ213.K8 2017', publisherName: 'McGraw-Hill Education', authorNames: ['Benjamin C. Kuo', 'Farid Golnaraghi'], categoryNames: ['Electrical Engineering'], floorNumber: 1, shelfCode: 'TK-1',
  },
  {
    title: 'Microelectronic Circuits',
    subtitle: 'Eighth Edition',
    description: 'Sedra and Smith\'s authoritative textbook covers semiconductor devices, operational amplifiers, diodes, bipolar and MOS transistors, single-stage and multistage amplifiers, feedback, oscillators, and digital CMOS logic circuits.',
    isbn: '978-0-19-933913-6',
    publicationYear: 2019, edition: '8th', subject: 'Electronics', language: 'English', pages: 1456, callNumber: 'TK7867.S43 2019', publisherName: 'Oxford University Press', authorNames: ['Adel S. Sedra', 'Kenneth C. Smith'], categoryNames: ['Electrical Engineering'], floorNumber: 1, shelfCode: 'TK-1',
  },
  {
    title: 'Power System Analysis',
    subtitle: 'Third Edition',
    description: 'Grainger and Stevenson provide comprehensive coverage of power system modeling, transmission line parameters, network calculations, power flow analysis, economic dispatch, fault analysis, and power system stability with practical engineering examples.',
    isbn: '978-0-07-061293-8',
    publicationYear: 1994, edition: '3rd', subject: 'Power Systems', language: 'English', pages: 784, callNumber: 'TK1001.G72 1994', publisherName: 'McGraw-Hill', authorNames: ['John J. Grainger', 'William D. Stevenson'], categoryNames: ['Electrical Engineering'], floorNumber: 1, shelfCode: 'TK-1',
  },

  // ── Business & Economics (7) ──
  {
    title: 'Principles of Economics',
    subtitle: 'Eighth Edition',
    description: 'Mankiw\'s bestselling economics textbook provides an accessible and engaging introduction to both microeconomics and macroeconomics. The ten principles of economics framework helps students think like economists about markets, policy, and globalization.',
    isbn: '978-1-305-58046-5',
    publicationYear: 2017, edition: '8th', subject: 'Economics', language: 'English', pages: 888, callNumber: 'HB171.5.M266 2017', publisherName: 'Cengage Learning', authorNames: ['N. Gregory Mankiw'], categoryNames: ['Economics'], floorNumber: 2, shelfCode: 'HA-1',
  },
  {
    title: 'Economics',
    subtitle: 'Nineteenth Edition',
    description: 'Samuelson and Nordhaus provide a comprehensive survey of economic principles and their application to contemporary issues. The text covers both micro and macroeconomics with a focus on policy applications and global economic challenges.',
    isbn: '978-0-07-802175-6',
    publicationYear: 2010, edition: '19th', subject: 'Economics', language: 'English', pages: 752, callNumber: 'HB171.5.S25 2010', publisherName: 'McGraw-Hill Education', authorNames: ['Paul A. Samuelson', 'William D. Nordhaus'], categoryNames: ['Economics'], floorNumber: 2, shelfCode: 'HA-1',
  },
  {
    title: 'Marketing Management',
    subtitle: 'Fifteenth Edition',
    description: 'Kotler and Keller\'s definitive marketing textbook covers marketing strategy, customer relationship management, brand equity, digital marketing, and global marketing with comprehensive case studies from leading companies worldwide.',
    isbn: '978-0-13-385660-5',
    publicationYear: 2016, edition: '15th', subject: 'Marketing', language: 'English', pages: 816, callNumber: 'HF5415.13.K67 2016', publisherName: 'Pearson Education', authorNames: ['Philip Kotler', 'Kevin Lane Keller'], categoryNames: ['Business & Management'], floorNumber: 2, shelfCode: 'HF-1',
  },
  {
    title: 'Organizational Behavior',
    subtitle: 'Eighteenth Edition',
    description: 'Robbins and Judge provide a comprehensive exploration of organizational behavior covering individual behavior, group behavior, and organizational processes. Topics include motivation, leadership, communication, power, conflict, and organizational culture.',
    isbn: '978-0-13-410393-8',
    publicationYear: 2017, edition: '18th', subject: 'Organizational Behavior', language: 'English', pages: 736, callNumber: 'HD58.7.R62 2017', publisherName: 'Pearson Education', authorNames: ['Stephen P. Robbins', 'Timothy A. Judge'], categoryNames: ['Business & Management'], floorNumber: 2, shelfCode: 'HF-1',
  },
  {
    title: 'The Economics of Institutions',
    subtitle: null,
    description: 'Oliver Williamson\'s Nobel Prize-winning work on transaction cost economics and the theory of the firm. This book analyzes how institutions emerge, how they govern economic activity, and how organizational forms adapt to reduce transaction costs.',
    isbn: '978-0-02-934820-4',
    publicationYear: 1985, edition: '1st', subject: 'Institutional Economics', language: 'English', pages: 264, callNumber: 'HB175.W55 1985', publisherName: 'Free Press', authorNames: ['Oliver E. Williamson'], categoryNames: ['Economics', 'Business & Management'], floorNumber: 2, shelfCode: 'HA-1',
  },
  {
    title: 'Financial Management: Theory & Practice',
    subtitle: 'Fifteenth Edition',
    description: 'Brigham and Ehrhardt\'s comprehensive finance textbook covers financial statements, time value of money, risk and return, bond and stock valuation, capital budgeting, cost of capital, capital structure, and working capital management.',
    isbn: '978-1-305-63297-4',
    publicationYear: 2017, edition: '15th', subject: 'Financial Management', language: 'English', pages: 1184, callNumber: 'HG173.B6985 2017', publisherName: 'Cengage Learning', authorNames: ['Eugene F. Brigham', 'Michael C. Ehrhardt'], categoryNames: ['Business & Management'], floorNumber: 2, shelfCode: 'HF-1',
  },
  {
    title: 'Business Research Methods',
    subtitle: 'Twelfth Edition',
    description: 'A comprehensive guide to conducting business research covering research design, data collection methods, measurement, sampling, survey research, experimental design, and data analysis with SPSS examples and real-world case studies.',
    isbn: '978-0-07-711837-3',
    publicationYear: 2014, edition: '12th', subject: 'Research Methods', language: 'English', pages: 792, callNumber: 'HF5606.C66 2014', publisherName: 'McGraw-Hill Education', authorNames: ['Donald R. Cooper', 'Pamela S. Schindler'], categoryNames: ['Business & Management'], floorNumber: 2, shelfCode: 'HF-1',
  },

  // ── Islamic Studies (3) ──
  {
    title: 'Islamic Science: An Illustrated Study',
    subtitle: null,
    description: 'Seyyed Hossein Nasr provides a richly illustrated survey of the scientific achievements of Islamic civilization, covering mathematics, astronomy, medicine, chemistry, and optics from the 8th to the 15th centuries and their influence on the European Renaissance.',
    isbn: '978-0-86784-201-3',
    publicationYear: 1976, edition: '1st', subject: 'Islamic Civilization', language: 'English', pages: 288, callNumber: 'Q127.I73 N37 1976', publisherName: 'World of Islam Festival Publishing', authorNames: ['Seyyed Hossein Nasr'], categoryNames: ['Islamic Studies'], floorNumber: 2, shelfCode: 'BP-1',
  },
  {
    title: 'The Muslim Community of the Indo-Pakistan Subcontinent',
    subtitle: '610-1947',
    description: 'Ishtiaq Husain Qureshi provides a scholarly account of Muslim history in the Indian subcontinent from the arrival of Islam to the creation of Pakistan. The book covers political, social, and cultural developments across twelve centuries.',
    isbn: '978-0-19-634220-4',
    publicationYear: 1977, edition: '1st', subject: 'South Asian Muslim History', language: 'English', pages: 352, callNumber: 'DS355.Q87 1977', publisherName: 'Oxford University Press', authorNames: ['Ishtiaq Husain Qureshi'], categoryNames: ['Islamic Studies'], floorNumber: 2, shelfCode: 'BP-1',
  },
  {
    title: 'Towards Understanding Islam',
    subtitle: null,
    description: 'Abul A\'la Maududi\'s influential introduction to Islamic thought covers the fundamental concepts of Islam including the nature of God, prophethood, the Quranic worldview, the Islamic way of life, the economic system, and the political philosophy of Islam.',
    isbn: '978-0-86037-041-8',
    publicationYear: 1980, edition: '1st', subject: 'Islamic Thought', language: 'English', pages: 224, callNumber: 'BP161.2.M3813 1980', publisherName: 'Islamic Foundation', authorNames: ['Abul A\'la Maududi'], categoryNames: ['Islamic Studies'], floorNumber: 2, shelfCode: 'BP-1',
  },

  // ── Environmental Science (4) ──
  {
    title: 'Silent Spring',
    subtitle: null,
    description: 'Rachel Carson\'s groundbreaking work documented the devastating environmental effects of indiscriminate pesticide use, particularly DDT. This book launched the modern environmental movement and led to the creation of the U.S. Environmental Protection Agency.',
    isbn: '978-0-618-24906-0',
    publicationYear: 1962, edition: '1st', subject: 'Environmental Studies', language: 'English', pages: 400, callNumber: 'QH545.P4 C3 1962', publisherName: 'Houghton Mifflin', authorNames: ['Rachel Carson'], categoryNames: ['Environmental Science', 'Biology'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'The Diversity of Life',
    subtitle: null,
    description: 'Edward O. Wilson provides a sweeping exploration of biodiversity on Earth, from rainforest canopies to deep-sea vents. He explains the evolutionary processes that generate diversity, the current extinction crisis, and why preserving biodiversity is essential for humanity.',
    isbn: '978-0-393-31950-8',
    publicationYear: 1992, edition: '1st', subject: 'Biodiversity', language: 'English', pages: 432, callNumber: 'QH541.15.B56 W55 1992', publisherName: 'W. W. Norton', authorNames: ['Edward O. Wilson'], categoryNames: ['Environmental Science', 'Biology'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'Guns, Germs, and Steel: The Fates of Human Societies',
    subtitle: null,
    description: 'Jared Diamond\'s Pulitzer Prize-winning work investigates why certain civilizations conquered and dominated others. He argues that environmental and geographical factors, rather than racial or cultural superiority, determined the fates of human societies over the last 13,000 years.',
    isbn: '978-0-393-31755-9',
    publicationYear: 1997, edition: '1st', subject: 'Environmental Determinism', language: 'English', pages: 528, callNumber: 'HN13.D5 1997', publisherName: 'W. W. Norton', authorNames: ['Jared Diamond'], categoryNames: ['Environmental Science'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'Environmental Science: Earth as a Living Planet',
    subtitle: 'Ninth Edition',
    description: 'Botkin and Keller provide a comprehensive introduction to environmental science covering ecosystems, biomes, population dynamics, water resources, energy resources, air pollution, climate change, waste management, and environmental policy.',
    isbn: '978-1-118-42707-4',
    publicationYear: 2014, edition: '9th', subject: 'Environmental Science', language: 'English', pages: 688, callNumber: 'GE105.B68 2014', publisherName: 'Wiley', authorNames: ['Daniel B. Botkin', 'Edward A. Keller'], categoryNames: ['Environmental Science'], floorNumber: 1, shelfCode: 'QC-1',
  },

  // ── Chemistry (3) ──
  {
    title: 'Organic Chemistry',
    subtitle: 'Eighth Edition',
    description: 'Wade\'s organic chemistry textbook provides a mechanistic approach to organic reactions with clear explanations of reaction mechanisms, stereochemistry, spectroscopy, and the synthesis of organic molecules. The book includes hundreds of practice problems.',
    isbn: '978-0-321-76776-9',
    publicationYear: 2013, edition: '8th', subject: 'Organic Chemistry', language: 'English', pages: 1328, callNumber: 'QD251.3.W33 2013', publisherName: 'Pearson Education', authorNames: ['Leroy G. Wade'], categoryNames: ['Chemistry'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'Physical Chemistry',
    subtitle: 'Eleventh Edition',
    description: 'Atkins, de Paula, and Keeler provide a rigorous treatment of physical chemistry covering thermodynamics, quantum chemistry, statistical mechanics, kinetics, and surface chemistry with mathematical derivations and real-world applications.',
    isbn: '978-0-19-876986-6',
    publicationYear: 2018, edition: '11th', subject: 'Physical Chemistry', language: 'English', pages: 1040, callNumber: 'QD453.2.A85 2018', publisherName: 'Oxford University Press', authorNames: ['Peter Atkins', 'Julio de Paula', 'James Keeler'], categoryNames: ['Chemistry'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'Inorganic Chemistry',
    subtitle: 'Sixth Edition',
    description: 'Housecroft and Sharpe provide a comprehensive introduction to inorganic chemistry covering atomic structure, bonding, main group chemistry, transition metal chemistry, organometallic chemistry, and bioinorganic chemistry with modern applications.',
    isbn: '978-0-273-74275-6',
    publicationYear: 2012, edition: '6th', subject: 'Inorganic Chemistry', language: 'English', pages: 1120, callNumber: 'QD151.2.H68 2012', publisherName: 'Pearson Education', authorNames: ['Catherine E. Housecroft', 'Alan G. Sharpe'], categoryNames: ['Chemistry'], floorNumber: 1, shelfCode: 'QC-1',
  },

  // ── Literature (2) ──
  {
    title: 'A History of English Literature',
    subtitle: null,
    description: 'A comprehensive survey of English literature from Anglo-Saxon times to the present day. The book covers major authors, movements, and genres with detailed analysis of key works from Beowulf to contemporary postcolonial fiction.',
    isbn: '978-0-333-66330-6',
    publicationYear: 1997, edition: '1st', subject: 'English Literature', language: 'English', pages: 560, callNumber: 'PR83.B34 1997', publisherName: 'Palgrave Macmillan', authorNames: ['Michael Alexander'], categoryNames: ['Literature'], floorNumber: 2, shelfCode: 'P-1',
  },
  {
    title: 'Literary Theory: An Introduction',
    subtitle: 'Anniversary Edition',
    description: 'Terry Eagleton\'s seminal work provides a clear and accessible overview of modern literary theory, covering liberal humanism, structuralism, post-structuralism, psychoanalytic criticism, feminist criticism, and postmodernism with wit and critical insight.',
    isbn: '978-0-8166-1259-8',
    publicationYear: 2008, edition: '25th Anniversary', subject: 'Literary Theory', language: 'English', pages: 320, callNumber: 'PN81.E23 2008', publisherName: 'University of Minnesota Press', authorNames: ['Terry Eagleton'], categoryNames: ['Literature'], floorNumber: 2, shelfCode: 'P-1',
  },

  // ── Mechanical Engineering (3) ──
  {
    title: 'Fluid Mechanics',
    subtitle: 'Eighth Edition',
    description: 'Frank White\'s clear and accurate presentation of fluid mechanics fundamentals covers fluid statics, Bernoulli equation, dimensional analysis, internal and external viscous flows, open-channel flow, and compressible flow with engineering applications.',
    isbn: '978-0-07-339813-1',
    publicationYear: 2015, edition: '8th', subject: 'Fluid Mechanics', language: 'English', pages: 896, callNumber: 'TA357.W48 2015', publisherName: 'McGraw-Hill Education', authorNames: ['Frank M. White'], categoryNames: ['Mechanical Engineering'], floorNumber: 1, shelfCode: 'TA-1',
  },
  {
    title: 'Thermodynamics: An Engineering Approach',
    subtitle: 'Ninth Edition',
    description: 'Cengel and Boles provide a comprehensive introduction to thermodynamics covering basic concepts, pure substances, energy analysis, entropy, exergy, gas power cycles, vapor power cycles, refrigeration cycles, and reacting mixtures with an engineering problem-solving approach.',
    isbn: '978-1-259-82267-4',
    publicationYear: 2018, edition: '9th', subject: 'Thermodynamics', language: 'English', pages: 992, callNumber: 'TJ265.C42 2018', publisherName: 'McGraw-Hill Education', authorNames: ['Yunus A. Cengel', 'Michael A. Boles'], categoryNames: ['Mechanical Engineering'], floorNumber: 1, shelfCode: 'TA-1',
  },
  {
    title: 'Mechanics of Materials',
    subtitle: 'Tenth Edition',
    description: 'Hibbeler\'s textbook provides a clear and thorough presentation of the theory and application of mechanics of materials. It covers stress, strain, axial loading, torsion, bending, shear, combined loadings, column buckling, and energy methods.',
    isbn: '978-0-13-431965-0',
    publicationYear: 2017, edition: '10th', subject: 'Solid Mechanics', language: 'English', pages: 896, callNumber: 'TA405.H53 2017', publisherName: 'Pearson Education', authorNames: ['R. C. Hibbeler'], categoryNames: ['Mechanical Engineering'], floorNumber: 1, shelfCode: 'TA-1',
  },

  // ── Biology (3) ──
  {
    title: 'Campbell Biology',
    subtitle: 'Eleventh Edition',
    description: 'The most widely used biology textbook in the world, Campbell Biology provides a comprehensive introduction to all areas of biology including cell biology, genetics, evolution, plant biology, animal biology, and ecology with cutting-edge research and stunning visual presentations.',
    isbn: '978-0-13-409341-3',
    publicationYear: 2016, edition: '11th', subject: 'General Biology', language: 'English', pages: 1488, callNumber: 'QH308.2.C35 2016', publisherName: 'Pearson Education', authorNames: ['Lisa A. Urry', 'Michael L. Cain', 'Steven A. Wasserman', 'Peter V. Minorsky', 'Robert B. Jackson'], categoryNames: ['Biology'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'Molecular Biology of the Cell',
    subtitle: 'Sixth Edition',
    description: 'The definitive reference for cell biology provides a comprehensive treatment of cells, from molecular genetics and genome organization to cell signaling, cytoskeleton, and cell division. Written by leading researchers in the field.',
    isbn: '978-0-8153-4432-2',
    publicationYear: 2014, edition: '6th', subject: 'Cell Biology', language: 'English', pages: 1464, callNumber: 'QH581.2.M64 2014', publisherName: 'W. W. Norton', authorNames: ['Bruce Alberts', 'Alexander Johnson', 'Julian Lewis', 'David Morgan', 'Martin Raff', 'Keith Roberts', 'Peter Walter'], categoryNames: ['Biology'], floorNumber: 1, shelfCode: 'QC-1',
  },
  {
    title: 'Genetics: Analysis and Principles',
    subtitle: 'Sixth Edition',
    description: 'Brooker provides a clear introduction to genetics covering Mendelian genetics, chromosome theory, molecular genetics, gene regulation, mutation, population genetics, evolutionary genetics, and genomics with an emphasis on problem-solving and experimental analysis.',
    isbn: '978-1-259-61648-7',
    publicationYear: 2018, edition: '6th', subject: 'Genetics', language: 'English', pages: 864, callNumber: 'QH430.B766 2018', publisherName: 'McGraw-Hill Education', authorNames: ['Robert J. Brooker'], categoryNames: ['Biology'], floorNumber: 1, shelfCode: 'QC-1',
  },

  // ── Urdu language book ──
  {
    title: 'Quran aur Science',
    subtitle: null,
    description: 'یہ کتاب قرآن مجید اور جدید سائنس کے درمیان تعلق پر مبنی ہے۔ مختلف سائنسی نظریات کو قرآنی آیات کے ساتھ موازنہ کیا گیا ہے۔',
    isbn: '978-969-408-123-4',
    publicationYear: 2010, edition: '1st', subject: 'Science & Religion', language: 'Urdu', pages: 320, callNumber: 'BP130.4.Q83 2010', publisherName: 'Darul Ishaat', authorNames: ['Maurice Bucaille'], categoryNames: ['Islamic Studies'], floorNumber: 2, shelfCode: 'BP-1',
  },
  {
    title: 'Tareekh-e-Islam',
    subtitle: null,
    description: 'اسلام کی تاریخ کا جامع مکالمہ جو ابتدائے اسلام سے لے کر موجودہ دور تک کے اہم واقعات کو احاطہ کرتا ہے۔',
    isbn: '978-969-001-234-5',
    publicationYear: 2005, edition: '3rd', subject: 'Islamic History', language: 'Urdu', pages: 480, callNumber: 'BP50.T37 2005', publisherName: 'Ferozsons', authorNames: ['Syed Sulaiman Nadvi'], categoryNames: ['Islamic Studies'], floorNumber: 2, shelfCode: 'BP-1',
  },
];

// ── Main Seed Function ──
async function main() {
  console.log('Seeding COMSATS Library catalog...');
  console.time('seed');

  // 1. Create floors
  const floors: Record<number, string> = {};
  for (const floor of FLOORS) {
    const created = await db.floor.upsert({
      where: { floorNumber: floor.floorNumber },
      update: { name: floor.name, description: floor.description },
      create: floor,
    });
    floors[floor.floorNumber] = created.id;
    console.log(`  Floor ${floor.floorNumber}: ${floor.name}`);
  }

  // 2. Create shelves
  const shelves: Record<string, string> = {};
  for (const [floorNum, shelfList] of Object.entries(SHELVES)) {
    for (const shelf of shelfList) {
      const created = await db.shelf.upsert({
        where: { floorId_code: { floorId: floors[Number(floorNum)], code: shelf.code } },
        update: { section: shelf.section },
        create: {
          floorId: floors[Number(floorNum)],
          code: shelf.code,
          section: shelf.section,
        },
      });
      shelves[shelf.code] = created.id;
    }
  }
  console.log(`  Created ${Object.keys(shelves).length} shelves`);

  // 3. Create categories
  const categoryIds: Record<string, string> = {};
  for (const name of CATEGORIES) {
    const created = await db.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryIds[name] = created.id;
  }
  console.log(`  Created ${Object.keys(categoryIds).length} categories`);

  // 4. Create publishers
  const publisherIds: Record<string, string> = {};
  for (const name of PUBLISHERS) {
    const created = await db.publisher.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    publisherIds[name] = created.id;
  }
  console.log(`  Created ${Object.keys(publisherIds).length} publishers`);

  // 5. Create authors
  const authorIds: Record<string, string> = {};
  for (const name of AUTHORS) {
    const created = await db.author.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    authorIds[name] = created.id;
  }
  console.log(`  Created ${Object.keys(authorIds).length} authors`);

  // 6. Create books with copies
  let totalCopies = 0;
  const conditions = ['NEW', 'GOOD', 'GOOD', 'GOOD', 'FAIR'] as const;
  const copyStatuses = ['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'BORROWED', 'RESERVED'] as const;

  for (let i = 0; i < BOOKS.length; i++) {
    const book = BOOKS[i];
    const numCopies = 2 + Math.floor(Math.random() * 4); // 2-5 copies

    const createdBook = await db.book.upsert({
      where: { isbn: book.isbn! },
      update: {
        title: book.title,
        subtitle: book.subtitle ?? null,
        description: book.description,
        publicationYear: book.publicationYear,
        edition: book.edition,
        subject: book.subject,
        language: book.language,
        pages: book.pages,
        callNumber: book.callNumber,
        publisherId: publisherIds[book.publisherName] || null,
      },
      create: {
        title: book.title,
        subtitle: book.subtitle ?? null,
        description: book.description,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        edition: book.edition,
        subject: book.subject,
        language: book.language,
        pages: book.pages,
        callNumber: book.callNumber,
        publisherId: publisherIds[book.publisherName] || null,
      },
    });

    // Connect authors (create if not in main list)
    for (const authorName of book.authorNames) {
      let aId = authorIds[authorName];
      if (!aId) {
        const newAuthor = await db.author.upsert({
          where: { name: authorName },
          update: {},
          create: { name: authorName },
        });
        authorIds[authorName] = newAuthor.id;
        aId = newAuthor.id;
      }
      await db.bookAuthor.upsert({
        where: { bookId_authorId: { bookId: createdBook.id, authorId: aId } },
        update: {},
        create: { bookId: createdBook.id, authorId: aId },
      });
    }

    // Connect categories
    for (const catName of book.categoryNames) {
      if (categoryIds[catName]) {
        await db.bookCategory.upsert({
          where: { bookId_categoryId: { bookId: createdBook.id, categoryId: categoryIds[catName] } },
          update: {},
          create: { bookId: createdBook.id, categoryId: categoryIds[catName] },
        });
      }
    }

    // Connect publishers (create if not in main list)
    if (book.publisherName && !publisherIds[book.publisherName]) {
      const newPub = await db.publisher.upsert({
        where: { name: book.publisherName },
        update: {},
        create: { name: book.publisherName },
      });
      publisherIds[book.publisherName] = newPub.id;
      await db.book.update({
        where: { id: createdBook.id },
        data: { publisherId: newPub.id },
      });
    }
    const shelfId = shelves[book.shelfCode] || null;
    for (let c = 0; c < numCopies; c++) {
      const accNum = `AC-${String(2024000 + i * 10 + c).padStart(7, '0')}`;
      const bc = `BC-${String(100000 + i * 10 + c).padStart(8, '0')}`;
      const st = c < numCopies - 1 ? pick([...copyStatuses]) : 'AVAILABLE';

      const existing = await db.bookCopy.findUnique({ where: { accessionNumber: accNum } });
      if (!existing) {
        await db.bookCopy.create({
          data: {
            bookId: createdBook.id,
            accessionNumber: accNum,
            barcode: bc,
            shelfId,
            condition: pick([...conditions]),
            status: st,
          },
        });
        totalCopies++;
      }
    }
  }

  console.log(`  Created ${BOOKS.length} books with ${totalCopies} total copies`);

  // Summary
  const bookCount = await db.book.count();
  const copyCount = await db.bookCopy.count();
  const authorCount = await db.author.count();
  const categoryCount = await db.category.count();
  const publisherCount = await db.publisher.count();
  const availableCount = await db.bookCopy.count({ where: { status: 'AVAILABLE' } });

  console.log('\n═══ Seed Complete ═══');
  console.log(`  Books:          ${bookCount}`);
  console.log(`  Copies:         ${copyCount}`);
  console.log(`  Available:      ${availableCount}`);
  console.log(`  Authors:        ${authorCount}`);
  console.log(`  Categories:     ${categoryCount}`);
  console.log(`  Publishers:     ${publisherCount}`);
  console.log(`  Floors:         ${Object.keys(floors).length}`);
  console.log(`  Shelves:        ${Object.keys(shelves).length}`);
  console.timeEnd('seed');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
