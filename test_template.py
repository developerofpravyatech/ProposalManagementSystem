from jinja2 import Environment, FileSystemLoader, select_autoescape
import pathlib

TEMPLATE_DIR = pathlib.Path('backend/app/templates')
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)), autoescape=select_autoescape(['html','htm','xml']))
env.filters['nl2br'] = lambda x: str(x or '').replace('\n', '<br/>') if x else ''

t = env.get_template('proposal_template.html')
result = t.render(
    colors={'primary':'#C81D31','dark':'#2A2C35','accent':'#C81D31','light':'#F8FAFC','line':'#E2E8F0','muted':'#64748B'},
    cover={'project_title':'Test','office_address':'Test'},
    cover_letter={},
    company_profile={
        'core_values': [],
        'positioning': '',
        'vision': '',
        'mission': '',
    },
    services={},
    process={},
    clients={'bni':[],'regional':[],'international':[]},
    pricing={},
    payment={
        'upi_id':'PRAVYA2618@OKSBI',
        'bank_name':'STATE BANK OF INDIA',
        'account_number':'40410281486',
        'branch_name':'Bhanktinagar Station Main Road',
        'ifsc':'SBIN0001851',
        'qr_src':''
    },
    acceptance={},
    branches=[],
    closing_statement=''
)

check1 = 'payment-table' in result
check2 = all(x in result for x in ['Bank Name', 'Account No.', 'IFSC Code', 'UPI ID', 'Bhanktinagar'])
print(f'Payment table present: {"OK" if check1 else "FAIL"}')
print(f'Bank info in table: {"OK" if check2 else "FAIL"}')
