import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
    marginBottom: 15,
  },
  logoColumn: {
    width: "20%",
  },
  textColumn: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 60,
    width: "auto",
    objectFit: "contain",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerAddress: { fontSize: 10, textAlign: "center", lineHeight: 1.4 },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 5,
  },
  section: { marginBottom: 10 },
  bold: { fontWeight: "bold" },
  table: { borderWidth: 1, marginTop: 8 },
  row: { flexDirection: "row" },
  cell: { borderWidth: 1, padding: 5, flex: 1 },
  headerCell: { backgroundColor: "#eee", fontWeight: "bold" },
  sign: { marginTop: 12 },
});

const MinutesOfMeetingPdf = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Row: Logo(20%) | Address(80%) */}
      <View style={styles.headerRow}>
        <View style={styles.logoColumn}>
          {data.header.logo && (
            <Image src={data.header.logo} style={styles.logo} />
          )}
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.companyName}>{data.header.companyName}</Text>
          <Text style={styles.headerAddress}>{data.header.address}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{data.meeting.title}</Text>
      <Text style={styles.title}>Minutes of Meeting</Text>

      {/* Meeting Details */}
      <View style={styles.section}>
        <Text>Date: {data.meeting.date}</Text>
        <Text>Time: {data.meeting.time}</Text>
        <Text>Venue: {data.meeting.venue}</Text>
      </View>

      {/* Attendees */}
      <View style={styles.section}>
        <Text style={styles.bold}>Attendees:</Text>
        {data.attendees.map((a, idx) => (
          <Text key={idx}>• {a}</Text>
        ))}
      </View>

      {/* Discussion Summary */}
      <View style={styles.section}>
        <Text style={styles.bold}>Discussion Summary</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell]}>No</Text>
            <Text style={[styles.cell, styles.headerCell]}>Topic</Text>
            <Text style={[styles.cell, styles.headerCell]}>Discussion</Text>
          </View>

          {data.inputs.map((item) => (
            <View key={item.no} style={styles.row}>
              <Text style={styles.cell}>{item.no}</Text>
              <Text style={styles.cell}>{item.category}</Text>
              <Text style={styles.cell}>{item.discussion}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Items */}
      {data.outputs && data.outputs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.bold}>Action Items</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.headerCell]}>No</Text>
              <Text style={[styles.cell, styles.headerCell]}>Action</Text>
            </View>

            {data.outputs.map((item) => (
              <View key={item.no} style={styles.row}>
                <Text style={styles.cell}>{item.no}</Text>
                <Text style={styles.cell}>{item.action}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Sign Off */}
      <View style={styles.sign}>
        <Text>Prepared by: {data.signOff.preparedBy}</Text>
        <Text>Reviewed by: {data.signOff.reviewedBy}</Text>
        <Text>Approved by: {data.signOff.approvedBy}</Text>
      </View>
    </Page>
  </Document>
);

export default MinutesOfMeetingPdf;
