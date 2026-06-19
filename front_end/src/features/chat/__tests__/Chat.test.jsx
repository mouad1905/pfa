import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "../Chat";

// Mock the useChat custom hook
const mockUseChat = vi.fn();
vi.mock("../hooks/useChat", () => ({
  default: () => mockUseChat(),
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => vi.fn(),
}));

describe("Chat feature integration tests", () => {
  const defaultMockState = {
    activeConversation: null,
    messages: [],
    newMessage: "",
    searchQuery: "",
    contactSearchQuery: "",
    loadingList: false,
    loadingMessages: false,
    conversationsError: null,
    messagesError: null,
    sending: false,
    sendError: null,
    mobileView: "list",
    activeTab: "messages",
    contacts: [],
    loadingContacts: false,
    showAddContactModal: false,
    discoverSearchQuery: "",
    discoverResults: [],
    loadingDiscover: false,
    currentUser: { id_user: 1, prenom: "Jean", nom: "Dupont", role: "etudiant" },
    filteredConversations: [],
    filteredContacts: [],
    messagesEndRef: React.createRef(),
    messagesContainerRef: React.createRef(),
    pendingRetryRef: { current: null },
    setActiveConversation: vi.fn(),
    setNewMessage: vi.fn(),
    setSearchQuery: vi.fn(),
    setContactSearchQuery: vi.fn(),
    setActiveTab: vi.fn(),
    setShowAddContactModal: vi.fn(),
    setDiscoverSearchQuery: vi.fn(),
    handleSendMessage: vi.fn(),
    retrySend: vi.fn(),
    handleStartConversation: vi.fn(),
    goBack: vi.fn(),
    loadConversations: vi.fn(),
    loadMessages: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChat.mockReturnValue(defaultMockState);
  });

  it("renders Sidebar and shows EmptyChatState when no conversation is active", () => {
    render(<Chat />);
    
    // Sidebar should be present
    expect(screen.getByText("Messagerie")).toBeInTheDocument();
    
    // Empty chat state is rendered
    expect(screen.getByText("Discussions Privées")).toBeInTheDocument();
    expect(
      screen.getByText(/Sélectionnez l'une de vos conversations/i)
    ).toBeInTheDocument();
  });

  it("renders active conversation components (header, messages, and input)", () => {
    const activeConversation = {
      id_conversation: 1,
      other_user: { id_user: 2, prenom: "Marc", nom: "Lefebvre", role: "professeur" },
      dernier_message: { contenu: "Bonjour !", created_at: "2026-06-19T02:00:00Z" },
      unread_count: 0,
    };

    const messages = [
      {
        id_message: 101,
        contenu: "Bonjour !",
        id_expediteur: 2,
        created_at: "2026-06-19T02:00:00Z",
        statut: "lu",
      },
    ];

    mockUseChat.mockReturnValue({
      ...defaultMockState,
      activeConversation,
      messages,
      filteredConversations: [activeConversation],
    });

    render(<Chat />);

    // Renders other user name and role badge
    expect(screen.getByText("Marc Lefebvre")).toBeInTheDocument();
    expect(screen.getByText("Enseignant")).toBeInTheDocument();

    // Renders the message content
    expect(screen.getByText("Bonjour !")).toBeInTheDocument();

    // Renders input field
    expect(
      screen.getByPlaceholderText(/Votre message/i)
    ).toBeInTheDocument();
  });

  it("triggers tab switches and handles query updates in the sidebar", () => {
    const setSearchQueryMock = vi.fn();
    const setActiveTabMock = vi.fn();

    mockUseChat.mockReturnValue({
      ...defaultMockState,
      setSearchQuery: setSearchQueryMock,
      setActiveTab: setActiveTabMock,
    });

    render(<Chat />);

    // Click on contacts tab
    const contactsTab = screen.getByRole("button", { name: /Voir les contacts/i });
    fireEvent.click(contactsTab);
    expect(setActiveTabMock).toHaveBeenCalledWith("contacts");

    // Enter search text
    const searchInput = screen.getByPlaceholderText("Rechercher une discussion...");
    fireEvent.change(searchInput, { target: { value: "recherche" } });
    expect(setSearchQueryMock).toHaveBeenCalledWith("recherche");
  });

  it("triggers message sending on input form submission", () => {
    const handleSendMessageMock = vi.fn();
    const setNewMessageMock = vi.fn();
    const activeConversation = {
      id_conversation: 1,
      other_user: { id_user: 2, prenom: "Marc", nom: "Lefebvre", role: "professeur" },
    };

    mockUseChat.mockReturnValue({
      ...defaultMockState,
      activeConversation,
      newMessage: "Test message",
      handleSendMessage: handleSendMessageMock,
      setNewMessage: setNewMessageMock,
    });

    render(<Chat />);

    const textarea = screen.getByPlaceholderText(/Votre message/i);
    expect(textarea.value).toBe("Test message");

    const sendBtn = screen.getByLabelText("Envoyer le message");
    fireEvent.click(sendBtn);

    expect(handleSendMessageMock).toHaveBeenCalled();
  });

  it("renders AddContactModal overlay when showAddContactModal is true", () => {
    const setShowAddContactModalMock = vi.fn();

    mockUseChat.mockReturnValue({
      ...defaultMockState,
      showAddContactModal: true,
      setShowAddContactModal: setShowAddContactModalMock,
      discoverResults: [
        { id_user: 3, prenom: "Alice", nom: "Martin", role: "locateur", email: "alice@example.com" },
      ],
    });

    render(<Chat />);

    // Modal title is visible
    expect(screen.getByText("Ajouter un contact")).toBeInTheDocument();
    
    // User card is rendered inside modal
    expect(screen.getByText("Alice Martin")).toBeInTheDocument();
    expect(screen.getByText("Bailleur")).toBeInTheDocument();

    // Close button works
    const closeBtn = screen.getByLabelText("Fermer la modal");
    fireEvent.click(closeBtn);
    expect(setShowAddContactModalMock).toHaveBeenCalledWith(false);
  });
});
