export const mockAuthUser = {
  id: "admin-id-1",
  email: "admin@agecs.test",
  roles: ["SuperAdmin"],
  firstName: "Admin",
  lastName: "User",
  emailConfirmed: true
};

export const mockAuthStudent = {
  id: "student-id-1",
  email: "student@agecs.test",
  roles: ["Student"],
  firstName: "Student",
  lastName: "User",
  emailConfirmed: true
};

export const mockProducts = [
  {
    id: "p1",
    name: "AGECS RCD",
    fullName: "AGECS RCD - Reinforced Concrete Design",
    family: "SES",
    allowTrial: true,
    trialPeriod: 14,
    comingSoon: false,
    hidden: false,
    order: 1,
    withTaxes: true,
    children: [
      { id: "p1-c1", name: "BASIC", fullName: "RCD BASIC", janDrozdId: "101" },
      { id: "p1-c2", name: "PRO", fullName: "RCD PRO", janDrozdId: "102" }
    ],
    features: [
      { id: "f1", featureName: "Concrete Beams", allowInTrial: true },
      { id: "f2", featureName: "Advanced Analytics", allowInTrial: false }
    ],
    media: [
      { id: "m1", url: "/globe.svg" } // Using placeholder SVG
    ],
    prices: [
      { id: "pr1", country: "II", price: 50.00, period: 1, active: true },
      { id: "pr2", country: "EG", price: 1500.00, period: 1, active: true }
    ],
    activeVersions: [
      { id: "v1", versionNumber: "1.0.0", releaseNotes: "Initial Release", fileSizeBytes: 15000000, isActive: true, createdAtUtc: "2024-01-01T00:00:00Z" }
    ]
  },
  {
    id: "p2",
    name: "AGECS Steel",
    fullName: "AGECS Steel Design Tools",
    family: "SES",
    allowTrial: false,
    trialPeriod: 0,
    comingSoon: true,
    hidden: false,
    order: 2,
    withTaxes: true,
    children: [],
    features: [],
    media: [],
    prices: [],
    activeVersions: []
  }
];

export const mockLicenses = [
  {
    id: "l1",
    licenseKey: "XXXX-YYYY-ZZZZ-1111",
    userId: "student-id-1",
    userEmail: "student@agecs.test",
    productId: "p1",
    productName: "AGECS RCD",
    variantId: "p1-c2",
    variantName: "PRO",
    startDateUtc: "2024-01-01T00:00:00Z",
    endDateUtc: "2025-01-01T00:00:00Z",
    isTrial: false,
    isActive: true,
    isHwidBound: true,
    hardwareIds: ["HWID-12345"]
  }
];

export const mockTicketCategories = [
  { id: "cat1", name: "Technical Support", description: "Software issues" },
  { id: "cat2", name: "Billing", description: "Payment issues" }
];

export const mockTickets = [
  {
    id: "t1",
    categoryId: "cat1",
    categoryName: "Technical Support",
    userId: "student-id-1",
    userEmail: "student@agecs.test",
    subject: "Installation error",
    status: "Open",
    createdAtUtc: "2024-08-01T12:00:00Z",
    messages: [
      { id: "m1", userId: "student-id-1", userEmail: "student@agecs.test", message: "I cannot install the software.", createdAtUtc: "2024-08-01T12:00:00Z" }
    ]
  }
];

export const mockPromocodes = [
  {
    id: "promo1",
    code: "WELCOME2024",
    discountType: "Percentage",
    discountValue: 20,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2024-12-31T23:59:59Z",
    maxUses: 100,
    currentUses: 5,
    isActive: true
  },
  {
    id: "promo2",
    code: "FLAT50",
    discountType: "Fixed",
    discountValue: 50,
    validFrom: "2024-06-01T00:00:00Z",
    validTo: "2024-06-30T23:59:59Z",
    maxUses: 50,
    currentUses: 50,
    isActive: false
  }
];
