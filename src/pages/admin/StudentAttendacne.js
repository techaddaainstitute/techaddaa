import React, { useEffect, useState } from 'react';
import { Card, Table, Form, Button } from 'react-bootstrap';
import { FaSearch, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import AdminUsecase from '../../lib/usecase/AdminUsecase';

/**
 * StudentAttendacne
 * Attendance management component for Admin Dashboard
 * Props:
 *  - students: Array of student profiles (id, full_name, email, phone_number)
 */
const StudentAttendacne = ({ students = [] }) => {
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendanceMap, setAttendanceMap] = useState({}); // { [user_id]: attendanceRow }
  const [loading, setLoading] = useState(false);

  const loadAttendance = async (dateStr) => {
    try {
      setLoading(true);
      const result = await AdminUsecase.getAttendanceByDateUsecase(dateStr);
      const rows = result.success ? (result.attendance || []) : [];
      const map = {};
      rows.forEach((r) => { map[r.user_id] = r; });
      setAttendanceMap(map);
    } catch (error) {
      console.error('StudentAttendacne: load attendance error', error);
    } finally {
      setLoading(false);
    }
  };

  // Build phone links for dial and WhatsApp with basic sanitation
  const buildContactLinks = (raw) => {
    if (!raw) return { telHref: null, waHref: null };
    const digits = String(raw).replace(/[^\d+]/g, '');
    // tel: can keep plus sign
    const telHref = digits ? `tel:${digits}` : null;
    // WhatsApp requires country code without '+'
    let waDigits = digits.replace(/\+/g, '');
    if (/^\d{10}$/.test(waDigits)) {
      // Assume India if 10-digit local number
      waDigits = `91${waDigits}`;
    }
    const waHref = /^\d{11,15}$/.test(waDigits) ? `https://wa.me/${waDigits}` : null;
    return { telHref, waHref };
  };

  useEffect(() => {
    loadAttendance(attendanceDate);
  }, [attendanceDate]);

  const handleAttendanceFieldChange = async (userId, field, value) => {
    try {
      const prev = attendanceMap[userId] || {};
      const next = { ...prev, [field]: value };
      setAttendanceMap((m) => ({ ...m, [userId]: next }));

      await AdminUsecase.upsertAttendanceUsecase(userId, attendanceDate, next);

      // Refresh to capture any server defaults
      await loadAttendance(attendanceDate);
    } catch (error) {
      console.error('StudentAttendacne: update error', error);
    }
  };

  // Helper to update multiple fields atomically to avoid race conditions
  const handleAttendanceFieldsChange = async (userId, fields) => {
    try {
      const prev = attendanceMap[userId] || {};
      const next = { ...prev, ...fields };
      setAttendanceMap((m) => ({ ...m, [userId]: next }));

      await AdminUsecase.upsertAttendanceUsecase(userId, attendanceDate, next);
      await loadAttendance(attendanceDate);
    } catch (error) {
      console.error('StudentAttendacne: multi-field update error', error);
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Student Attendance</h5>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="date"
            size="sm"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            style={{ width: '160px' }}
          />
          <Button variant="outline-secondary" size="sm" onClick={() => setAttendanceDate(new Date().toISOString().slice(0, 10))}>

            Today
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={() => loadAttendance(attendanceDate)}>
            <FaSearch className="me-1" />
            Load
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Contact</th>
              <th>Presence</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">Loading attendance...</td>
              </tr>
            ) : (students && students.length > 0 ? (
              students.map((s) => {
                const rec = attendanceMap[s.id] || {};
                const { telHref, waHref } = buildContactLinks(s.phone_number);
                return (
                  <tr key={s.id}>
                    <td>{s.full_name || 'N/A'}</td>
                    <td>{s.email || '—'}</td>
                    <td>{s.phone_number || '—'}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {telHref ? (
                          <a
                            href={telHref}
                            className="btn btn-outline-primary btn-sm"
                            title="Call"
                          >
                            <FaPhoneAlt />
                          </a>
                        ) : (
                          <span className="text-muted" title="No phone">
                            <FaPhoneAlt />
                          </span>
                        )}
                        {waHref ? (
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-success btn-sm"
                            title="WhatsApp"
                          >
                            <FaWhatsapp />
                          </a>
                        ) : (
                          <span className="text-muted" title="Invalid WhatsApp number">
                            <FaWhatsapp />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`present-switch-${s.id}`}
                        label={(rec.status === 'present' || rec.status === 'late') ? 'Present' : 'Absent'}
                        checked={rec.status === 'present' || rec.status === 'late'}
                        onChange={(e) => {
                          const isOn = e.target.checked;
                          const newStatus = isOn ? 'present' : 'absent';
                          handleAttendanceFieldChange(s.id, 'status', newStatus);
                        }}
                      />
                    </td>
                    <td>
                      {(() => {
                        const predefined = ['Teacher Not Present', 'Student is Late'];
                        const remarkVal = (rec.remarks || '').trim();
                        const isOther = !!remarkVal && !predefined.includes(remarkVal);
                        const currentValue = predefined.includes(remarkVal)
                          ? remarkVal
                          : (isOther ? 'Other' : '');
                        return (
                          <>
                            <Form.Select
                              size="sm"
                              value={currentValue}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (!val) {
                                  handleAttendanceFieldChange(s.id, 'remarks', '');
                                  return;
                                }
                                if (val === 'Other') {
                                  const custom = window.prompt('Enter other remark');
                                  if (custom && custom.trim()) {
                                    handleAttendanceFieldChange(s.id, 'remarks', custom.trim());
                                  }
                                  return;
                                }
                                // Predefined remark selected: upsert both fields atomically
                                if (val === 'Student is Late') {
                                  handleAttendanceFieldsChange(s.id, { remarks: val, status: 'present' });
                                  return;
                                }
                                if (val === 'Teacher Not Present') {
                                  handleAttendanceFieldsChange(s.id, { remarks: val, status: 'absent' });
                                  return;
                                }
                                // Fallback
                                handleAttendanceFieldChange(s.id, 'remarks', val);
                              }}
                              style={{ minWidth: '200px' }}
                            >
                              <option value="">—</option>
                              <option value="Teacher Not Present">Teacher Not Present</option>
                              <option value="Student is Late">Student is Late</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                            {isOther && (
                              <div className="mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                {rec.remarks}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">No students found</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default StudentAttendacne;
