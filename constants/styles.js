import { StyleSheet, Platform } from 'react-native';

// --- FINALIZED COLOR PALETTE ---
// Consolidated to the most modern and vibrant color set.
export const COLORS = {
    // Primary Branding
    PRIMARY_PURPLE: '#503794ff',      // Brighter, modern purple
    ACCENT_TEAL: '#396e67ff',         // Vibrant Teal (CTA color)

    // Backgrounds & Text
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    BG_LIGHT: '#F0F4F8',            // Very light, clean background
    TEXT_DARK: '#263238',           // Dark charcoal text
    TEXT_MEDIUM: '#78909C',         // Muted gray for secondary text
    TEXT_LIGHT: '#FFFFFF',          // White text
    BORDER_COLOR: '#E0E0E0',        // Light border

    // Feature Colors (Schedule)
    SPRAY_BLUE_DARK: '#039BE5',
    SPRAY_BLUE_LIGHT: '#E1F5FE',    // Very light blue background
    FERTILIZER_GREEN_DARK: '#4CAF50',
    FERTILIZER_GREEN_LIGHT: '#E8F5E9',// Very light green background
    NOTE_YELLOW_DARK: '#FFB300',
    NOTE_YELLOW_LIGHT: '#FFFDE7',
    
    // Legacy mapping (using the stronger codes)
    DARK_GREEN: '#4CAF50', // Used for old tab active colors
};

export const styles = StyleSheet.create({
    // --- Global & Layout ---
    safeArea: { flex: 1, backgroundColor: COLORS.BG_LIGHT },
    container: { flex: 1, backgroundColor: COLORS.BG_LIGHT },
    scrollContent: { paddingBottom: 40 },

    // --- Header (General Navigation Header) ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16, // Use 16 for standard spacing
        paddingVertical: 12, // Slightly more vertical padding
        paddingTop: Platform.OS === 'ios' ? 55 : 30, // Increased iOS top padding
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR,
    },
    headerTitle: { 
        flex: 1, 
        fontSize: 21, // Slightly larger title
        fontWeight: '800', // Bolder title
        color: COLORS.TEXT_DARK, 
        textAlign: 'center' 
    },
    backButton: { 
        width: 50, // Fixed width for alignment and larger tap target
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: -10, // Adjusted margin to pull the button icon visually closer to the edge
    },

    // --- Home Screen (Original, applying general color updates) ---
    homeHeaderContainer: { paddingBottom: 20 },
    homeHeaderGradient: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    homeHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homeHeaderTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeHeaderLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    homeTitle: { fontSize: 38, fontWeight: 'bold', color: COLORS.TEXT_LIGHT },
    weatherWidget: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE, padding: 15, marginHorizontal: 20, marginTop: -30, borderRadius: 15, elevation: 8, shadowColor: COLORS.BLACK, shadowOpacity: 0.15, shadowRadius: 15 },
    weatherInfo: { marginLeft: 15 },
    weatherLocation: { fontSize: 16, fontWeight: 'bold', color: COLORS.TEXT_DARK },
    weatherDetails: { fontSize: 14, color: COLORS.TEXT_MEDIUM },
    homeButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginTop: 20 },
    homeButton: { flex: 1, backgroundColor: COLORS.WHITE, paddingVertical: 15, borderRadius: 15, marginHorizontal: 5, elevation: 4, shadowColor: COLORS.BLACK, shadowOpacity: 0.1, shadowRadius: 8 },
    homeButtonText: { textAlign: 'center', fontWeight: 'bold', color: COLORS.PRIMARY_PURPLE },
    homeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 15, marginTop: 10 },
    gridItem: { width: '48%', backgroundColor: COLORS.WHITE, borderRadius: 15, marginBottom: 15, elevation: 4, shadowColor: COLORS.BLACK, shadowOpacity: 0.1, shadowRadius: 8, overflow: 'hidden' },
    gridImage: { width: '100%', height: 120 },
    gridText: { padding: 15, fontSize: 16, fontWeight: '600', color: COLORS.TEXT_DARK },
    testimonialCard: { backgroundColor: COLORS.PRIMARY_PURPLE, padding: 25, marginHorizontal: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    testimonialText: { marginLeft: 15, fontStyle: 'italic', color: COLORS.TEXT_LIGHT, flex: 1, fontSize: 16 },


    // --- Login Screen (Original, applying general color updates) ---
    loginContainer: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: COLORS.PRIMARY_PURPLE },
    loginContent: { alignItems: 'center', width: '100%' },
    loginLogoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 30, overflow: 'hidden' },
    loginLogoImage: { width: '100%', height: '100%' },
    loginTitle: { fontSize: 34, fontWeight: 'bold', color: COLORS.TEXT_LIGHT, marginBottom: 8 },
    loginSubtitle: { fontSize: 16, color: COLORS.TEXT_LIGHT, opacity: 0.8, marginBottom: 40 },
    inputContainer: { width: '100%', marginBottom: 15 },
    inputLabel: { color: COLORS.TEXT_LIGHT, fontSize: 14, marginBottom: 8, opacity: 0.9, paddingLeft: 5 },
    loginInput: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 20, fontSize: 16, color: COLORS.TEXT_LIGHT, width: '100%' },
    loginButton: { backgroundColor: COLORS.WHITE, padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 20 },
    loginButtonText: { color: COLORS.TEXT_DARK, fontSize: 18, fontWeight: 'bold' }, // Adjusted color

    // --- Generic Content & List Pages (Original) ---
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20, color: COLORS.TEXT_DARK },
    listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE, padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER_COLOR },
    listItemText: { flex: 1, marginLeft: 15, fontSize: 16, color: COLORS.TEXT_DARK },
    legalHeading: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20, color: COLORS.TEXT_DARK, marginTop: 20 },
    legalBody: { fontSize: 16, lineHeight: 26, color: COLORS.TEXT_MEDIUM, paddingHorizontal: 20 },

    // --- Contact Page (Original) ---
    enquiryForm: { padding: 20 },
    input: { backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_COLOR, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
    submitButton: { backgroundColor: COLORS.PRIMARY_PURPLE, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: COLORS.TEXT_LIGHT, fontSize: 16, fontWeight: 'bold' },

    // --- Community/Training/Gallery Pages (Original) ---
    topTabs: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderColor: COLORS.BORDER_COLOR },
    topTab: { paddingVertical: 15, flex: 1, alignItems: 'center' },
    topTabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.ACCENT_TEAL },
    topTabText: { fontSize: 16, color: COLORS.TEXT_MEDIUM },
    topTabTextActive: { fontSize: 16, color: COLORS.ACCENT_TEAL, fontWeight: 'bold' },
    cardListContainer: { padding: 20 },
    card: { backgroundColor: COLORS.WHITE, borderRadius: 12, marginBottom: 20, elevation: 3, shadowColor: COLORS.BLACK, shadowOpacity: 0.1, shadowRadius: 5, overflow: 'hidden' },
    cardImage: { width: '100%', height: 180 },
    cardTitle: { padding: 15, fontSize: 18, fontWeight: '600', color: COLORS.TEXT_DARK },

    // ========================================================
    // --- FARMER SCHEDULE SCREEN (ENHANCED FOR BEST STYLING) ---
    // ========================================================

    // --- Plot Info Header ---
    plotHeaderContainer: { // Holds Plot Name and Pruning Date
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR,
        // Add a soft bottom shadow for depth
        ...Platform.select({
            ios: { shadowColor: COLORS.BLACK, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1 },
            android: { elevation: 1 },
        }),
    },
    plotNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.TEXT_DARK,
    },
    pruningDateText: {
        fontSize: 14,
        color: COLORS.TEXT_MEDIUM,
        marginTop: 4,
    },

    // --- Day List Item Styles (Enhanced Card Look) ---
    itemContainer: {
        backgroundColor: COLORS.WHITE,
        padding: 18, // Increased padding
        borderRadius: 12, // Modern rounded corners
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensures perfect alignment
        // Sharper, more pronounced shadow
        ...Platform.select({
            ios: { shadowColor: COLORS.BLACK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 },
            android: { elevation: 6 },
        }),
    },
    itemIcon: {
        marginRight: 18,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.ACCENT_TEAL, // Use accent color for calendar icon
    },
    itemTextContainer: { flex: 1 },
    itemTitle: { 
        fontSize: 19, 
        fontWeight: '800', // Very bold
        color: COLORS.TEXT_DARK 
    },
    itemDescription: { 
        fontSize: 13, 
        color: COLORS.TEXT_MEDIUM, 
        marginTop: 2 
    },

    // --- Error/No Data States ---
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30, 
        marginTop: 0, // Removed obsolete marginTop
    },
    infoText: { 
        fontSize: 18, 
        color: COLORS.TEXT_MEDIUM, 
        textAlign: 'center', 
        marginTop: 20 
    },
    button: { // Try Again Button
        backgroundColor: COLORS.PRIMARY_PURPLE, 
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 30, // Fully rounded pill shape
        marginTop: 30,
        ...Platform.select({ // Stronger button shadow
            ios: { shadowColor: COLORS.PRIMARY_PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
            android: { elevation: 8 },
        }),
    },
    buttonText: { color: COLORS.WHITE, fontSize: 17, fontWeight: 'bold' },
    
    // Placeholder styles
    skeletonIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.BORDER_COLOR },
    skeletonText: { backgroundColor: COLORS.BORDER_COLOR, borderRadius: 4, height: 16 },

    // --- Modal Styles (Modern Bottom Sheet) ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)', // Darker overlay
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 20,
        borderTopLeftRadius: 28, // More rounded corners
        borderTopRightRadius: 28,
        paddingTop: 50, 
        paddingBottom: 20,
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: COLORS.BG_LIGHT, // Light background for the close button
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    modalHeader: { // Left-aligned, high-impact header
        marginBottom: 20,
        paddingBottom: 0,
        alignItems: 'flex-start', // **Perfect Alignment Fix**
        borderBottomWidth: 0,
    },
    modalTitle: {
        fontSize: 32, // Large, impactful title
        fontWeight: '900',
        color: COLORS.PRIMARY_PURPLE,
    },
    modalDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Left-aligned date info
        width: '100%',
        marginTop: 4,
    },
    modalDay: { 
        fontSize: 15, 
        color: COLORS.TEXT_MEDIUM, 
        fontWeight: '600',
        marginRight: 4,
    },
    modalDate: { 
        fontSize: 15, 
        color: COLORS.TEXT_DARK,
        fontWeight: '700'
    },
    noScheduleText: {
        textAlign: 'center',
        fontSize: 17,
        color: COLORS.TEXT_MEDIUM,
        fontStyle: 'italic',
        paddingVertical: 40,
    },

    // --- Detail Section Styles (Inside Modal) ---
    detailSection: { 
        marginBottom: 20, 
        paddingVertical: 10,
    },
    detailSectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 4,
        borderBottomWidth: 3, // Thicker underline for emphasis
        borderBottomColor: COLORS.BORDER_COLOR,
    },
    detailSectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.TEXT_DARK,
        marginLeft: 8,
    },

    // --- Detail Item (Spray/Fertilizer Cards) ---
    detailItemContainer: { // The card container for each spray/fert item
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 6, // Thick, modern left indicator
    },
    sprayBackground: { 
        backgroundColor: COLORS.SPRAY_BLUE_LIGHT,
        borderLeftColor: COLORS.SPRAY_BLUE_DARK,
    },
    fertilizerBackground: { 
        backgroundColor: COLORS.FERTILIZER_GREEN_LIGHT,
        borderLeftColor: COLORS.FERTILIZER_GREEN_DARK,
    },
    detailItemTitle: { // Medicine Name / Fertilizer Title
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.TEXT_DARK,
        marginBottom: 4,
    },
    detailItemDescription: { // Dose / Instructions
        fontSize: 15,
        color: COLORS.TEXT_DARK,
        lineHeight: 22,
    },
    detailItemCode: { // Note
        fontSize: 13,
        color: COLORS.TEXT_MEDIUM,
        marginTop: 8,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    
    // NOTE Style (Improved)
    noteText: {
        fontSize: 15,
        color: COLORS.TEXT_DARK,
        lineHeight: 24,
        backgroundColor: COLORS.NOTE_YELLOW_LIGHT,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.NOTE_YELLOW_DARK,
        fontWeight: '500',
        marginTop: 10,
    },

    // Retained unused legacy detail styles for completeness
    detailItemGroupContainer: { 
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
    }, 
    detailItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR,
    },
    detailItemRowLast: {
        borderBottomWidth: 0,
    },
    detailItemName: {
        fontSize: 16,
        color: COLORS.TEXT_DARK,
        flex: 1, 
        fontWeight: '600',
    },
    detailItemQuantity: {
        fontSize: 16,
        color: COLORS.TEXT_DARK,
        fontWeight: 'bold',
        minWidth: 40,
        textAlign: 'right',
    },
    detailItemUnit: {
        fontSize: 16,
        color: COLORS.TEXT_MEDIUM,
        marginLeft: 4,
        minWidth: 30,
    },
});


export default styles;
