import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 16, textAlign: "center", marginBottom: 12 },
  section: { marginBottom: 10 },
  bold: { fontWeight: "bold" },
});

const MinutesOfMeetingPdf = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Minutes of Meeting</Text>

      <View style={styles.section}>
        <Text>Date: {data.meeting.date}</Text>
        <Text>Time: {data.meeting.time}</Text>
        <Text>Venue: {data.meeting.venue}</Text>
        <Text>Chairperson: {data.meeting.chairedBy}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Discussion Summary</Text>
        {data.agenda.map((item) => (
          <View key={item.sr} style={{ marginTop: 6 }}>
            <Text style={styles.bold}>
              {item.sr}) {item.agenda}
            </Text>
            <Text>{item.reviewActivities}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Attendees</Text>
        {data.attendees.map((a) => (
          <Text key={a}>• {a}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text>
          Prepared By: {data.review.reviewedBy.name},{" "}
          {data.review.reviewedBy.role}
        </Text>
        <Text>Approved By: {data.review.approvedBy.name}</Text>
      </View>
    </Page>
  </Document>
);

export default MinutesOfMeetingPdf;
