from decimal import Decimal

class ServicePackage:
    """package_type: 'clinic' | 'patient' — gói cho phòng khám hay cho người dùng (bệnh nhân)."""
    def __init__(self, package_id: int, name: str, price: Decimal,
                 image_limit: int, duration_days: int, package_type: str = 'patient'):
        self.package_id = package_id
        self.name = name
        self.price = price
        self.image_limit = image_limit
        self.duration_days = duration_days
        self.package_type = package_type  # 'clinic' | 'patient'

