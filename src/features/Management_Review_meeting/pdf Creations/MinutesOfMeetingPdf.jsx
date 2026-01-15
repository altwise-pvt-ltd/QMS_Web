import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  header: { textAlign: "center", fontSize: 9, marginBottom: 10 },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
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
      {/* Address */}
      <Text style={styles.header}>{data.header.address}</Text>

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
