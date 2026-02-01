from sqlalchemy import Column, Integer, BigInteger, ForeignKey, DateTime
from infrastructure.databases.base import Base
from datetime import datetime


class ClinicPatientAllocationModel(Base):
    """
    Phòng khám cấp credits_allocated lượt upload cho bệnh nhân.
    Khi upload: trừ subscription.remaining_credits (clinic) và tăng credits_used ở đây.
    """
    __tablename__ = 'clinic_patient_allocations'
    __table_args__ = {'extend_existing': True}

    allocation_id = Column(BigInteger, primary_key=True, autoincrement=True)
    clinic_account_id = Column(BigInteger, ForeignKey('accounts.account_id'), nullable=False)
    patient_account_id = Column(BigInteger, ForeignKey('accounts.account_id'), nullable=False)
    credits_allocated = Column(Integer, nullable=False)
    credits_used = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<ClinicPatientAllocationModel(allocation_id={self.allocation_id}, clinic={self.clinic_account_id}, patient={self.patient_account_id}, used={self.credits_used}/{self.credits_allocated})>"
