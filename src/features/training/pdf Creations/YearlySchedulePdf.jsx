import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  header: {
    padding: "20px 30px",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 40,
    objectFit: "contain",
  },
  orgInfo: {
    width: "80%",
    textAlign: "center",
    justifyContent: "center",
  },
  orgName: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  orgAddress: {
    fontSize: 9,
    color: "#444",
  },
  titleContainer: {
    textAlign: "center",
    padding: "10px 0",
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    textDecoration: "underline",
  },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    minHeight: 25,
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 9,
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: "center",
    color: "grey",
    borderTopWidth: 0.5,
    borderTopColor: "#bcbcbc",
    paddingTop: 10,
  },
});

const YearlySchedulePdf = ({ trainings, year, organization }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {organization?.logo ? (
              <Image src={organization.logo} style={styles.logo} />
            ) : (
              <View style={{ width: 40, height: 40, backgroundColor: "#000", borderRadius: 4 }} />
            )}
          </View>
          <View style={styles.orgInfo}>
            <Text style={styles.orgName}>{organization?.name || "Your Company Name"}</Text>
            <Text style={styles.orgAddress}>
              {organization?.address || "Your Company Address"}
              {organization?.phone && ` | Tel: ${organization.phone}`}
              {organization?.websiteUrl && ` | Web: ${organization.websiteUrl}`}
            </Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Yearly Training Schedule - {year || new Date().getFullYear()}</Text>
        </View>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "45%" }]}>
              <Text style={styles.tableCellHeader}>Training Topic</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "25%" }]}>
              <Text style={styles.tableCellHeader}>Assignee / Target</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
          </View>

          {/* Rows */}
          {trainings && trainings.length > 0 ? (
            trainings.map((t, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={styles.tableCell}>
                    {new Date(t.dueDate).toLocaleDateString("en-GB")}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "45%" }]}>
                  <Text style={styles.tableCell}>{t.title}</Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text style={styles.tableCell}>
                    {t.assignedTo || t.targetGroup}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text
                    style={[styles.tableCell, { textTransform: "capitalize" }]}
                  >
                    {t.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "100%" }]}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>
                  No training records found.
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          Generated on: {new Date().toLocaleDateString()} - QMS Training
          Management System
        </Text>
      </Page>
    </Document>
  );
};

export default YearlySchedulePdf;
