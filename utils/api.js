// Utility functions for API requests
export async function fetchEventList(groupId, eventIds = [], startDate, endDate, daily = false) {
  const formData = new URLSearchParams();
  formData.append("lid", groupId);
//   (eventIds || []).forEach(id => formData.append("eids[]", id));
// formData.append("eids[]", "-1");
  formData.append("start", startDate);
  formData.append("end", endDate);
  formData.append("daily", daily.toString());

  console.log("Fetching event list with:", {
    groupId,
    eventIds,
    startDate,
    endDate,
    daily,
  });

  const response = await fetch(`https://booking.sjlibrary.org/admin/spaces/confirmed/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: 'include',
  });

  console.log("Response from fetchEventList:", response);

  return response.json();
}

export async function fetchEventDetails(bookId) {
  const response = await fetch(`https://booking.sjlibrary.org/admin/equipment/ajax/viewbooking/panel?bookId=${bookId}`);
  const html = await response.text();
  return html;
}
