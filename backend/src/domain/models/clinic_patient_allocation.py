"""Domain model: allocation of upload credits from clinic to patient."""

class ClinicPatientAllocation:
    """
    Phòng khám cấp một số lượt upload cho bệnh nhân (từ pool gói clinic).
    Khi bệnh nhân upload ảnh: trừ 1 từ allocation.credits_used và từ subscription.remaining_credits của clinic.
    """
    def __init__(self, allocation_id: int, clinic_account_id: int, patient_account_id: int,
                 credits_allocated: int, credits_used: int = 0):
        self.allocation_id = allocation_id
        self.clinic_account_id = clinic_account_id
        self.patient_account_id = patient_account_id
        self.credits_allocated = credits_allocated
        self.credits_used = credits_used

    @property
    def credits_remaining(self) -> int:
        return max(0, self.credits_allocated - self.credits_used)
