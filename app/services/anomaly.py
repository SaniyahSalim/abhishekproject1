def detect_anomalies(results):
    anomalies = []
    for result in results:
        if result['status'] != "Normal":
            anomalies.append(result)
    return anomalies